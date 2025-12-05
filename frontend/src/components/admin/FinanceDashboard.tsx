import React, { useState, useEffect } from 'react';
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatEther, parseAbiItem, decodeEventLog, keccak256, toBytes } from 'viem';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI } from '../../lib/contracts';
import { useChainId } from 'wagmi';
import { EVENT_PRICES } from '../../data/eventPrices';
import { SEAT_LAYOUTS } from '../../data/seatLayouts';

const FinanceDashboard = () => {
    const { address } = useAccount();
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[11155111];
    const publicClient = usePublicClient();

    const [revenueData, setRevenueData] = useState<{ venue: string, totalWei: bigint, events: { eventId: number, name: string, totalWei: bigint, sold: number, capacity: number }[] }[]>([]);
    const [debugInfo, setDebugInfo] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [totalContractBalance, setTotalContractBalance] = useState<string>('0');

    // Withdraw Logic
    const { writeContract: writeWithdraw, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
    const { isLoading: isConfirmingWithdraw, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

    const fetchRevenue = async () => {
        if (!publicClient || !contractAddress) return;
        setIsLoading(true);

        try {
            // 1. Get Contract Balance
            const balance = await publicClient.getBalance({ address: contractAddress });
            setTotalContractBalance(formatEther(balance));

            // 2. Get Past Events using Etherscan API
            // This avoids RPC range limits and is faster for full history
            const topic0 = keccak256(toBytes('SeatPurchased(uint16,uint64,address,uint256)'));
            // 2. Get Transactions from Etherscan V2 API
            // This is more reliable than getLogs for unverified contracts or indexing issues
            const apiKey = 'VM6KK95PGNC9KCVI2QH71G451593H927U1';
            const apiUrl = `https://api.etherscan.io/v2/api?chainid=11155111&module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

            setDebugInfo(`Fetching transactions from: ${apiUrl.replace(apiKey, 'API_KEY')}...`);

            const response = await fetch(apiUrl);
            const data = await response.json();

            let txs = [];
            if (data.status === "1" && Array.isArray(data.result)) {
                txs = data.result;
            } else if (data.message === "No transactions found") {
                txs = [];
            } else {
                console.warn("Etherscan API Error:", data);
                setDebugInfo(`API Error: ${JSON.stringify(data)}`);
            }

            setDebugInfo(`Found ${txs.length} transactions. Scanning for sales...`);

            const revenueMap = new Map<number, bigint>();
            const salesMap = new Map<number, number>();
            let processedCount = 0;
            let salesCount = 0;

            // Process transactions in parallel batches to speed up
            const batchSize = 5;
            for (let i = 0; i < txs.length; i += batchSize) {
                const batch = txs.slice(i, i + batchSize);
                await Promise.all(batch.map(async (tx: any) => {
                    if (tx.isError === "1") return; // Skip failed txs

                    try {
                        const receipt = await publicClient.getTransactionReceipt({ hash: tx.hash as `0x${string}` });

                        receipt.logs.forEach(log => {
                            try {
                                const decoded = decodeEventLog({
                                    abi: TICKETPASS_ABI,
                                    data: log.data,
                                    topics: log.topics
                                });

                                if (decoded.eventName === 'SeatPurchased') {
                                    const args = decoded.args as any;
                                    const eventId = Number(args.eventId);
                                    const priceWei = BigInt(args.priceWei);

                                    const current = revenueMap.get(eventId) || 0n;
                                    revenueMap.set(eventId, current + priceWei);

                                    const currentSales = salesMap.get(eventId) || 0;
                                    salesMap.set(eventId, currentSales + 1);

                                    salesCount++;
                                }
                            } catch (e) {
                                // Not a SeatPurchased event or decode failed
                            }
                        });
                    } catch (e) {
                        console.warn(`Failed to fetch receipt for ${tx.hash}`, e);
                    }
                }));
                processedCount += batch.length;
                setDebugInfo(`Scanning... Processed ${Math.min(processedCount, txs.length)}/${txs.length} transactions. Found ${salesCount} sales so far.`);
            }

            setDebugInfo(`Scan Complete.\nTotal Transactions Checked: ${txs.length}\nTicket Sales Found: ${salesCount}`);

            // 3. Format and Group Data by Venue
            const venueMap = new Map<string, { totalWei: bigint, events: any[] }>();

            // Helper to calculate capacity
            const calculateCapacity = (prices: any) => {
                let total = 0;
                Object.keys(prices).forEach(sectionKey => {
                    const layout = SEAT_LAYOUTS[sectionKey];
                    if (layout) {
                        // Sum FF and DD subsections
                        Object.values(layout).forEach(sub => {
                            sub.rows.forEach(row => {
                                total += row.seats.length;
                            });
                        });
                    }
                });
                return total;
            };

            EVENT_PRICES.forEach(event => {
                const revenue = revenueMap.get(event.eventId) || 0n;
                const venue = event.venue;
                const sold = salesMap.get(event.eventId) || 0;
                const capacity = calculateCapacity(event.prices);

                if (!venueMap.has(venue)) {
                    venueMap.set(venue, { totalWei: 0n, events: [] });
                }

                const venueData = venueMap.get(venue)!;
                venueData.totalWei += revenue;
                venueData.events.push({
                    eventId: event.eventId,
                    name: event.eventName || `Event ${event.eventId}`,
                    totalWei: revenue,
                    sold,
                    capacity
                });
            });

            // Convert to array for rendering
            const groupedData = Array.from(venueMap.entries()).map(([venue, data]) => ({
                venue,
                totalWei: data.totalWei,
                events: data.events.sort((a, b) => Number(b.totalWei - a.totalWei))
            })).sort((a, b) => Number(b.totalWei - a.totalWei));

            setRevenueData(groupedData as any); // Update state type if needed

        } catch (error) {
            console.error("Error fetching revenue:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, [publicClient, contractAddress, isWithdrawSuccess]);

    const handleWithdraw = () => {
        if (!address) return;
        writeWithdraw({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'withdraw',
            args: [address],
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Panel Financiero</h2>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Balance Total en Contrato</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>{totalContractBalance} ETH</p>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f5f5f5' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Evento</th>
                            <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Ingresos (ETH)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Cargando datos de la blockchain...</td>
                            </tr>
                        ) : revenueData.length > 0 ? (
                            revenueData.map((venueGroup) => (
                                <React.Fragment key={venueGroup.venue}>
                                    {/* Venue Header */}
                                    <tr style={{ background: '#e3f2fd', borderBottom: '1px solid #bbdefb' }}>
                                        <td colSpan={2} style={{ padding: '1rem', fontWeight: 'bold', color: '#1565c0' }}>
                                            {venueGroup.venue}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#1565c0', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                                            Total: Ξ {formatEther(venueGroup.totalWei)}
                                        </td>
                                    </tr>
                                    {/* Events in Venue */}
                                    {venueGroup.events.map((item) => (
                                        <tr key={item.eventId} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem', paddingLeft: '2rem', color: '#666' }}>#{item.eventId}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                                    Boletos: {item.sold} / {item.capacity > 0 ? item.capacity : '?'}
                                                    {item.capacity > 0 && ` (${Math.round((item.sold / item.capacity) * 100)}%)`}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem', color: item.totalWei > 0n ? '#333' : '#999' }}>
                                                {item.totalWei > 0n ? `Ξ ${formatEther(item.totalWei)}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No hay ventas registradas aún.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
                <h3 style={{ marginTop: 0, color: '#1565c0' }}>Retirar Fondos</h3>
                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                    Transfiere todo el balance del contrato ({totalContractBalance} ETH) a tu cartera de administrador ({address?.slice(0, 6)}...{address?.slice(-4)}).
                </p>
                <button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || isConfirmingWithdraw || Number(totalContractBalance) === 0}
                    style={{
                        marginTop: '1rem',
                        padding: '0.8rem 2rem',
                        background: isWithdrawing || isConfirmingWithdraw ? '#ccc' : '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isWithdrawing || isConfirmingWithdraw || Number(totalContractBalance) === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    {isWithdrawing || isConfirmingWithdraw ? 'Procesando Retiro...' : 'Retirar Todo'}
                </button>
                {isWithdrawSuccess && <p style={{ marginTop: '1rem', color: 'green', fontWeight: 'bold' }}>✅ Retiro exitoso!</p>}
            </div>

            {/* Debug Info */}
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#333', color: '#0f0', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', overflowX: 'auto' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Debug Info:</p>
                <pre style={{ margin: 0 }}>{debugInfo}</pre>
            </div>
        </div>
    );
};

export default FinanceDashboard;
