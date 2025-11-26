import React, { useMemo } from 'react';
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI, SectionCode, SubSectionCode, encodeSeatId, mapSectionToCode } from '../lib/contracts';

const SEPOLIA_ID = 11155111;

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

    // --- 1. Fetch Prices for All Sections (Representative Seat) ---
    const sectionsToQuery = [
        { label: 'LUNETA_ALTA', code: SectionCode.LUNETA_ALTA },
        { label: 'LUNETA_BAJA', code: SectionCode.LUNETA_BAJA },
        { label: 'PLATEA_ALTA', code: SectionCode.PLATEA_ALTA },
        { label: 'PLATEA_BAJA', code: SectionCode.PLATEA_BAJA },
        { label: 'PALCO', code: SectionCode.PALCO },
        { label: 'CORO', code: SectionCode.CORO },
        { label: 'CORO_LATERAL', code: SectionCode.CORO_LATERAL },
    ];

    // Create a dummy seat ID for each section to quote its price
    const sectionSeatIds = sectionsToQuery.map(s =>
        encodeSeatId(eventId, s.code, SubSectionCode.DD, 1, 1)
    );

    const { data: sectionPricesWei } = useReadContracts({
        contracts: sectionSeatIds.map(id => ({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'quoteSeatPriceWei',
            args: [id],
        })),
    });

    // Map section label to price in Wei
    const priceMapWei = useMemo(() => {
        const map: Record<string, bigint> = {};
        if (sectionPricesWei) {
            sectionPricesWei.forEach((result, idx) => {
                if (result.status === 'success') {
                    map[sectionsToQuery[idx].label] = result.result as bigint;
                }
            });
        }
        return map;
    }, [sectionPricesWei]);

    // Helper to get price for a section (Wei)
    const getSectionPriceWei = (sectionLabel: string): bigint | undefined => {
        // Handle potential label mismatches or partial matches if needed
        const key = sectionsToQuery.find(s => sectionLabel.includes(s.label))?.label;
        return key ? priceMapWei[key] : undefined;
    };

    // --- 2. Calculate Totals ---
    const seatIds = selectedSeats.map((s) => {
        const sectionCode: SectionCode = mapSectionToCode(s.section);
        const sub: SubSectionCode = s.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
        return encodeSeatId(eventId, sectionCode, sub, Number(s.row), Number(s.number));
    });

    // Fetch exact total from contract (best source of truth)
    const { data: totalWei, isLoading: isLoadingPrice, error: priceError } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'quoteTotalWei',
        args: [eventId, seatIds],
        query: { enabled: seatIds.length > 0 },
    });

    // Fallback total if contract call fails or empty (sum of individual section prices)
    const estimatedTotalWei = selectedSeats.reduce((acc, seat) => {
        return acc + (getSectionPriceWei(seat.section) || 0n);
    }, 0n);

    const finalTotalWei = totalWei ?? estimatedTotalWei;

    // --- 3. Purchase Logic ---
    const handlePayment = async () => {
        if (!isConnected || seatIds.length === 0 || !finalTotalWei) return;

        if (chainId !== SEPOLIA_ID) {
            switchChain({ chainId: SEPOLIA_ID });
            return;
        }

        if (balance && balance.value < finalTotalWei) {
            alert("Fondos insuficientes para realizar la compra.");
            return;
        }

        writeContract({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'purchase',
            args: [eventId, seatIds],
            value: finalTotalWei,
        }, {
            onError: (err) => console.error("Write contract error:", err),
        });
    };

    // --- 4. Admin Helpers (kept for now) ---
    const { writeContract: setPrice } = useWriteContract();
    const { writeContract: setRates } = useWriteContract();
    const { data: usdPerMxn } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'usdPerMxnE6',
    });

    const handleFixRates = () => {
        const SEPOLIA_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
        const RATE = BigInt(50000); // 1 MXN = 0.05 USD
        setRates({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'setRates',
            args: [SEPOLIA_FEED, RATE],
        });
    };

    const handleSetPrice = () => {
        if (selectedSeats.length === 0) return;
        const seat = selectedSeats[0];
        const sectionCode = mapSectionToCode(seat.section);
        const sub = seat.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
        // Default prices if not set
        let priceMxn = 265;
        if (seat.section.includes('LUNETA_ALTA')) priceMxn = 309;
        if (seat.section.includes('LUNETA_BAJA')) priceMxn = 398;

        const priceCents = BigInt(priceMxn * 100);

        setPrice({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'setSectionPriceMXN',
            args: [eventId, sectionCode, sub, priceCents],
        });
    };

    const isPriceMissingError = priceError?.message?.includes("Seat price not set") ||
        priceError?.message?.includes("Seat price not set (MXN)");

    return (
        <div>
            {/* Admin Controls */}
            {(usdPerMxn === 0n) && (
                <div style={{ marginBottom: '1rem' }}>
                    <button onClick={handleFixRates} style={{ background: '#ff5722', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Admin: Inicializar Tasas
                    </button>
                </div>
            )}

            {selectedSeats.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    <p>Selecciona tus asientos en el mapa.</p>
                    <div style={{ marginTop: '1rem', textAlign: 'left', fontSize: '0.9rem' }}>
                        <strong>Precios estimados (ETH):</strong>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {sectionsToQuery.map(s => {
                                const p = priceMapWei[s.label];
                                // If p is undefined, it's loading. If p is 0, it might be unset or free.
                                // But typically unset prices revert or return 0 depending on implementation.
                                // Here we assume if it's undefined it's loading.
                                return (
                                    <li key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                                        <span>{s.label.replace('_', ' ')}</span>
                                        <span>
                                            {p !== undefined
                                                ? (p > 0n ? `${formatEther(p).substring(0, 6)} ETH` : 'No disponible')
                                                : 'Consultando...'}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {selectedSeats.map((seat, idx) => {
                            const p = getSectionPriceWei(seat.section);
                            return (
                                <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{seat.section.replace('_', ' ')} {seat.subSection}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Fila {seat.row} - Asiento {seat.number}</div>
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {p ? `${formatEther(p).substring(0, 6)} ETH` : '...'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total Estimado</span>
                            <span>{finalTotalWei ? `${formatEther(finalTotalWei).substring(0, 8)} ETH` : '...'}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right', marginBottom: '1rem' }}>
                            (Sujeto a tipo de cambio al momento de la compra)
                        </div>

                        {priceError && (
                            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Error al cotizar: {priceError.message}
                                {isPriceMissingError && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <button onClick={handleSetPrice} style={{ background: '#ff9800', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                            Admin: Configurar Precio
                                        </button>
                                    </div>
                                )}
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
                                    background: isPending || isConfirming || isLoadingPrice || !finalTotalWei ? '#ccc' : '#6200ea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: isPending || isConfirming || isLoadingPrice || !finalTotalWei ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handlePayment}
                                disabled={isPending || isConfirming || isLoadingPrice || !finalTotalWei}
                            >
                                {isLoadingPrice ? 'Cotizando...' : isPending ? 'Confirmando...' : 'Pagar con MetaMask'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSummary;
