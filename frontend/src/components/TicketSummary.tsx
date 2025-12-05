import React, { useMemo } from 'react';
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance, useReadContracts } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI, SectionCode, SubSectionCode, encodeSeatId, mapSectionToCode, getRowNumber } from '../lib/contracts';
import { EVENT_PRICES } from '../data/eventPrices';

const SEPOLIA_ID = 11155111;
const CHAINLINK_FEED_ADDRESS = '0x694AA1769357215DE4FAC081bf1f309aDC325306';
const CHAINLINK_ABI = [{
    inputs: [],
    name: "latestRoundData",
    outputs: [
        { name: "roundId", type: "uint80" },
        { name: "answer", type: "int256" },
        { name: "startedAt", type: "uint256" },
        { name: "updatedAt", type: "uint256" },
        { name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
}] as const;

interface TicketSummaryProps {
    eventId: number;
    selectedSeats: any[];
}

const TicketSummary: React.FC<TicketSummaryProps> = ({ eventId, selectedSeats }) => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });
    const { data: balance } = useBalance({ address });

    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];

    // --- 1. Get Prices from Local Config (Source of Truth for UI) ---
    const eventPriceConfig = EVENT_PRICES.find(e => e.eventId === eventId);

    // --- 1b. Fetch On-Chain Prices for Selected Seats ---
    // Get unique sections from selected seats to minimize calls
    const uniqueSections = useMemo(() => {
        const sections = new Set(selectedSeats.map(s => s.section));
        return Array.from(sections);
    }, [selectedSeats]);

    const { data: onChainPrices } = useReadContracts({
        contracts: uniqueSections.map(section => ({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'sectionPricesMXN',
            args: [eventId, mapSectionToCode(section), SubSectionCode.DD], // Assuming DD/FF have same price
        })),
    });

    const getSectionPriceMXN = (sectionLabel: string): number => {
        // 1. Try to find on-chain price
        const sectionIndex = uniqueSections.indexOf(sectionLabel);
        if (sectionIndex >= 0 && onChainPrices && onChainPrices[sectionIndex]) {
            const result = onChainPrices[sectionIndex];
            if (result.status === 'success' && result.result) {
                const priceCents = Number(result.result);
                if (priceCents > 0) {
                    return priceCents / 100;
                }
            }
        }

        // 2. Fallback to local config
        if (!eventPriceConfig) return 0;
        const key = Object.keys(eventPriceConfig.prices).find(k => sectionLabel.includes(k)) as keyof typeof SectionCode | undefined;
        return key ? (eventPriceConfig.prices[key] || 0) : 0;
    };

    // --- 2. Fetch Exchange Rates for Estimation ---
    // A. USD per MXN from Contract
    const { data: usdPerMxnE6 } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'usdPerMxnE6',
    });

    // B. ETH/USD from Chainlink
    const { data: roundData } = useReadContract({
        address: CHAINLINK_FEED_ADDRESS,
        abi: CHAINLINK_ABI,
        functionName: 'latestRoundData',
        chainId: SEPOLIA_ID, // Always query Sepolia feed
    });

    const ethUsdPrice = roundData ? Number(roundData[1]) : 0; // 8 decimals

    // --- 3. Calculate Totals ---
    const totalMXN = selectedSeats.reduce((acc, seat) => acc + getSectionPriceMXN(seat.section), 0);

    // Calculate ETH required based on contract formula:
    // Wei = (mxnCents * usdPerMxnE6 * 1e18) / ethUsd
    const estimatedWei = useMemo(() => {
        if (!totalMXN || !usdPerMxnE6 || !ethUsdPrice) return 0n;
        const mxnCents = BigInt(Math.floor(totalMXN * 100));
        const usdPerMxn = BigInt(usdPerMxnE6); // 6 decimals
        const ethUsd = BigInt(ethUsdPrice); // 8 decimals

        // Formula: (mxnCents * usdPerMxn * 1e18) / ethUsd
        // Note: Contract divides by ethUsd (which is 8 decimals), effectively multiplying by 1e8/Price
        // Let's match contract logic exactly:
        // return (mxnCents * usdPerMxnE6 * 1e18) / uint256(ethUsd);
        return (mxnCents * usdPerMxn * 1000000000000000000n) / ethUsd;
    }, [totalMXN, usdPerMxnE6, ethUsdPrice]);

    // Add 2% buffer for fluctuations (refunded by contract)
    const finalWeiWithBuffer = (estimatedWei * 102n) / 100n;

    // --- 4. Purchase Logic ---
    const handlePayment = async () => {
        if (!isConnected) return;

        if (chainId !== SEPOLIA_ID) {
            switchChain({ chainId: SEPOLIA_ID });
            return;
        }

        if (selectedSeats.length === 0) return;

        const seatIds = selectedSeats.map((s) => {
            const sectionCode: SectionCode = mapSectionToCode(s.section);
            const sub: SubSectionCode = s.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
            return encodeSeatId(eventId, sectionCode, sub, getRowNumber(s.row), Number(s.number));
        });

        if (balance && balance.value < finalWeiWithBuffer) {
            alert("Fondos insuficientes (incluyendo buffer de seguridad).");
            return;
        }

        writeContract({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'purchase',
            args: [eventId, seatIds],
            value: finalWeiWithBuffer,
        }, {
            onError: (err) => console.error("Write contract error:", err),
        });
    };

    // --- Admin Helper: Check and Initialize Prices ---
    const firstSeat = selectedSeats[0];

    // Check if price is set on contract for the first selected seat
    const { data: onChainPriceMXN } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'sectionPricesMXN',
        args: firstSeat ? [eventId, mapSectionToCode(firstSeat.section), firstSeat.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD] : undefined,
        query: { enabled: !!firstSeat }
    });

    const isPriceSetOnChain = onChainPriceMXN !== undefined && onChainPriceMXN > 0n;

    const { writeContract: setPrice } = useWriteContract();
    const handleSyncPrice = () => {
        if (!firstSeat) return;
        const sectionCode = mapSectionToCode(firstSeat.section);
        const sub = firstSeat.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
        const price = getSectionPriceMXN(firstSeat.section);
        if (price > 0) {
            setPrice({
                address: contractAddress,
                abi: TICKETPASS_ABI,
                functionName: 'setSectionPriceMXN',
                args: [eventId, sectionCode, sub, BigInt(price * 100)],
            });
        }
    };

    return (
        <div>
            {selectedSeats.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    <p>Selecciona tus asientos en el mapa.</p>
                </div>
            ) : (
                <div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {selectedSeats.map((seat, idx) => {
                            const price = getSectionPriceMXN(seat.section);
                            // Calculate individual ETH estimate
                            let seatWei = 0n;
                            if (price && usdPerMxnE6 && ethUsdPrice) {
                                const cents = BigInt(Math.floor(price * 100));
                                seatWei = (cents * BigInt(usdPerMxnE6) * 1000000000000000000n) / BigInt(ethUsdPrice);
                            }

                            return (
                                <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{seat.section.replace('_', ' ')} {seat.subSection}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Fila {seat.row} - Asiento {seat.number}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold' }}>${price.toLocaleString()} MXN</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                            ≈ {seatWei > 0n ? formatEther(seatWei).substring(0, 6) : '...'} ETH
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${totalMXN.toLocaleString()} MXN</span>
                        </div>
                        <div style={{ textAlign: 'right', marginBottom: '1rem', color: '#666' }}>
                            ≈ {estimatedWei > 0n ? formatEther(estimatedWei).substring(0, 6) : '...'} ETH
                        </div>

                        {/* Admin Warning: Price not set */}
                        {!isPriceSetOnChain && isConnected && (
                            <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #ffb74d' }}>
                                <div style={{ color: '#e65100', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    ⚠️ Precio no configurado en contrato
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#e65100', marginBottom: '0.5rem' }}>
                                    Para evitar errores y fees altos, primero debes registrar el precio en la blockchain.
                                </div>
                                <a
                                    href="/admin"
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        background: '#ff9800',
                                        color: 'white',
                                        textDecoration: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        width: '100%'
                                    }}
                                >
                                    Ir al Dashboard de Admin
                                </a>
                            </div>
                        )}

                        {writeError && (
                            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Error: {writeError.message.split('\n')[0]}
                            </div>
                        )}

                        {isConfirming && <div style={{ color: 'orange', marginBottom: '1rem' }}>Confirmando transacción...</div>}
                        {isConfirmed && <div style={{ color: 'green', marginBottom: '1rem' }}>¡Compra exitosa!</div>}

                        {!isConnected ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ConnectButton />
                            </div>
                        ) : (
                            <button
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: isPending || isConfirming || !estimatedWei || !isPriceSetOnChain ? '#ccc' : '#6200ea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: isPending || isConfirming || !estimatedWei || !isPriceSetOnChain ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handlePayment}
                                disabled={isPending || isConfirming || !estimatedWei || !isPriceSetOnChain}
                            >
                                {isPending ? 'Confirmando...' : 'Pagar con MetaMask'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSummary;
