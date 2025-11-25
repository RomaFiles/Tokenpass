import React from 'react';
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACT_ADDRESS, TICKETPASS_ABI, SectionCode, SubSectionCode, encodeSeatId, mapSectionToCode } from '../lib/contracts';

const EVENT_ID = 1;
const SEPOLIA_ID = 11155111;

interface TicketSummaryProps {
    selectedSeats: any[];
}

const TicketSummary: React.FC<TicketSummaryProps> = ({ selectedSeats }) => {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    const getPrice = (section: string) => {
        // Mock pricing logic for display (MXN)
        if (section.includes('LUNETA_ALTA')) return 309;
        if (section.includes('LUNETA_BAJA')) return 398;
        return 265;
    };

    const total = selectedSeats.reduce((acc, seat) => acc + getPrice(seat.section), 0);

    const seatIds = selectedSeats.map((s) => {
        const sectionCode: SectionCode = mapSectionToCode(s.section);
        const sub: SubSectionCode = s.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
        return encodeSeatId(EVENT_ID, sectionCode, sub, Number(s.row), Number(s.number));
    });

    // value exacto desde el contrato (convierte MXN->wei internamente)
    const { data: totalWei, isLoading: isLoadingPrice, error: priceError } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: TICKETPASS_ABI,
        functionName: 'quoteTotalWei',
        args: [EVENT_ID, seatIds],
        query: { enabled: seatIds.length > 0 },
    });

    const handlePayment = async () => {
        if (!isConnected || seatIds.length === 0 || totalWei === undefined) return;

        if (chainId !== SEPOLIA_ID) {
            switchChain({ chainId: SEPOLIA_ID });
            return;
        }

        writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: TICKETPASS_ABI,
            functionName: 'purchase',
            args: [EVENT_ID, seatIds],
            value: totalWei as bigint,
        }, {
            onError: (err) => console.error("Write contract error:", err),
        });
    };

    // Admin helper to set price if missing
    const { writeContract: setPrice } = useWriteContract();
    const { writeContract: setRates } = useWriteContract();

    // Debug rates (kept for logic but removed from UI display)
    const { data: usdPerMxn } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: TICKETPASS_ABI,
        functionName: 'usdPerMxnE6',
    });

    const { data: ethFeed } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: TICKETPASS_ABI,
        functionName: 'ethUsdFeed',
    });

    const handleSetPrice = () => {
        if (selectedSeats.length === 0) return;
        // Take the first seat to determine section/subsection
        const seat = selectedSeats[0];
        const sectionCode = mapSectionToCode(seat.section);
        const sub = seat.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
        const priceMxn = getPrice(seat.section);
        const priceCents = BigInt(priceMxn * 100);

        setPrice({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: TICKETPASS_ABI,
            functionName: 'setSectionPriceMXN',
            args: [EVENT_ID, sectionCode, sub, priceCents],
        }, {
            onSuccess: () => {
                alert("Precio configurado. Por favor espera unos segundos y recarga la página.");
            },
            onError: (err) => {
                console.error("Error setting price:", err);
                alert("Error al configurar precio: " + err.message);
            }
        });
    };

    const handleFixRates = () => {
        // Sepolia Chainlink ETH/USD
        const SEPOLIA_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
        // 1 MXN = ~0.05 USD (50000 with 6 decimals)
        const RATE = BigInt(50000);

        setRates({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: TICKETPASS_ABI,
            functionName: 'setRates',
            args: [SEPOLIA_FEED, RATE],
        }, {
            onSuccess: () => {
                alert("Tasas configuradas. Por favor espera unos segundos y recarga la página.");
            },
            onError: (err) => {
                console.error("Error setting rates:", err);
                alert("Error al configurar tasas: " + err.message);
            }
        });
    };

    const isPriceMissingError = priceError?.message?.includes("Seat price not set") ||
        priceError?.message?.includes("Seat price not set (MXN)");

    return (
        <div>
            {/* Admin Controls (Only visible if needed) */}
            {(usdPerMxn === 0n) && (
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={handleFixRates}
                        style={{
                            background: '#ff5722',
                            color: 'white',
                            border: 'none',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        Admin: Inicializar Tasas de Cambio
                    </button>
                </div>
            )}

            {selectedSeats.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    Selecciona tus asientos en el mapa para continuar
                </div>
            ) : (
                <div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {selectedSeats.map((seat, idx) => (
                            <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{seat.section.replace('_', ' ')} {seat.subSection}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Fila {seat.row} - Asiento {seat.number}</div>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    ${getPrice(seat.section)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${total} MXN</span>
                        </div>

                        {priceError && (
                            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Error al cotizar precio: {priceError.message}
                                {isPriceMissingError && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <button
                                            onClick={handleSetPrice}
                                            style={{
                                                background: '#ff9800',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Admin: Configurar Precio (${getPrice(selectedSeats[0].section)})
                                        </button>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>
                                            (Requiere ser owner del contrato)
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {writeError && (
                            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Error: {writeError.message.split('\n')[0]}
                            </div>
                        )}

                        {isConfirming && (
                            <div style={{ color: 'orange', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Confirmando transacción...
                            </div>
                        )}

                        {isConfirmed && (
                            <div style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                ¡Compra exitosa!
                            </div>
                        )}

                        {!isConnected ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ConnectButton />
                            </div>
                        ) : (
                            <button
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: isPending || isConfirming || isLoadingPrice ? '#ccc' : '#6200ea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: isPending || isConfirming || isLoadingPrice ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handlePayment}
                                disabled={isPending || isConfirming || isLoadingPrice}
                            >
                                {isLoadingPrice ? 'Cotizando...' : isPending ? 'Confirmando en Wallet...' : 'Pagar con MetaMask'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSummary;
