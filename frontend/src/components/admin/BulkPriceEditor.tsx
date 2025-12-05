import React, { useState, useEffect } from 'react';
import { useReadContracts, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract } from 'wagmi';
import { TICKETPASS_ABI, CONTRACT_ADDRESSES, getContractAddress, SectionCode, SubSectionCode, mapSectionToCode, getExchangeRate } from '../../lib/contracts';
import { EVENT_PRICES } from '../../data/eventPrices';

const SEPOLIA_ID = 11155111;

const BulkPriceEditor: React.FC = () => {
    // Exchange Rate State
    const [currentRate, setCurrentRate] = useState<string>("");
    const [newRate, setNewRate] = useState<string>("");
    const [isFetchingRate, setIsFetchingRate] = useState(false);

    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];
    const { writeContract, data: txHash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    const [eventId, setEventId] = useState<number | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<string>("");
    const [prices, setPrices] = useState<Record<string, number>>({});

    // Helper to get all section keys from the enum
    const sectionKeys = Object.keys(SectionCode).filter(k => isNaN(Number(k)));

    const { data: onChainPrices, refetch: refetchPrices } = useReadContracts({
        contracts: eventId ? sectionKeys.map(key => ({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'sectionPricesMXN',
            args: [eventId, mapSectionToCode(key), SubSectionCode.DD],
        })) : [],
    });

    const { data: usdPerMxnE6, refetch: refetchRate } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'usdPerMxnE6',
    });

    useEffect(() => {
        if (usdPerMxnE6) {
            // Convert E6 to standard rate (e.g. 50000 -> 0.05)
            // Invert to show MXN/USD (e.g. 20)
            const rate = Number(usdPerMxnE6) / 1000000;
            if (rate > 0) {
                setCurrentRate((1 / rate).toFixed(2));
            }
        }
    }, [usdPerMxnE6]);

    const handleFetchRate = async () => {
        setIsFetchingRate(true);
        const rate = await getExchangeRate();
        if (rate) {
            setNewRate(rate.toString());
        }
        setIsFetchingRate(false);
    };

    const handleUpdateRate = () => {
        if (!newRate) return;
        const rate = parseFloat(newRate);
        if (isNaN(rate) || rate <= 0) return;

        // Convert MXN/USD (e.g. 20) to USD/MXN E6 (e.g. 0.05 * 1e6 = 50000)
        const usdPerMxn = 1 / rate;
        const usdPerMxnE6Val = Math.floor(usdPerMxn * 1000000);

        writeContract({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'setRates',
            args: ['0x694AA1769357215DE4FAC081bf1f309aDC325306', BigInt(usdPerMxnE6Val)], // Sepolia ETH/USD Feed
        });
    };

    // Get unique venues
    const venues = Array.from(new Set(EVENT_PRICES.map(ep => ep.venue)));

    // Filter events by selected venue
    const filteredEvents = EVENT_PRICES.filter(ep => ep.venue === selectedVenue);

    // Reset event selection when venue changes
    useEffect(() => {
        setEventId(null);
        setPrices({});
    }, [selectedVenue]);

    // Load default prices when eventId changes
    useEffect(() => {
        if (!eventId) return;
        const eventConfig = EVENT_PRICES.find(e => e.eventId === eventId);
        if (eventConfig && eventConfig.prices) {
            // Convert numbers to string keys for the form
            // We need to map the SectionCode keys (strings) to our state
            const newPrices: Record<string, number> = {};
            Object.entries(eventConfig.prices).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    newPrices[key] = value;
                }
            });
            setPrices(newPrices);
        } else {
            setPrices({});
        }
    }, [eventId]);

    // Update prices from on-chain data
    useEffect(() => {
        if (onChainPrices) {
            setPrices(prevPrices => {
                const newPrices = { ...prevPrices };
                let hasUpdates = false;

                onChainPrices.forEach((result, index) => {
                    if (result.status === 'success' && result.result) {
                        const priceCents = Number(result.result);
                        if (priceCents > 0) {
                            const key = sectionKeys[index];
                            newPrices[key] = priceCents / 100;
                            hasUpdates = true;
                        }
                    }
                });

                return hasUpdates ? newPrices : prevPrices;
            });
        }
    }, [onChainPrices]);

    // Refetch prices after successful update
    useEffect(() => {
        if (isConfirmed) {
            refetchPrices();
            refetchRate();
            alert("Actualización exitosa!");
        }
    }, [isConfirmed, refetchPrices, refetchRate]);

    const handlePriceChange = (sectionKey: string, value: string) => {
        setPrices(prev => ({
            ...prev,
            [sectionKey]: Number(value)
        }));
    };

    const handleBulkUpdate = async () => {
        if (!eventId) {
            alert("Por favor selecciona un evento.");
            return;
        }
        try {
            const sections: number[] = [];
            const subSections: number[] = [];
            const priceValues: bigint[] = [];

            // Iterate over the prices state
            Object.entries(prices).forEach(([key, price]) => {
                // Get the numeric code for the section
                // key is like "LUNETA_BAJA"
                const sectionCode = SectionCode[key as keyof typeof SectionCode];

                if (sectionCode) {
                    const priceCents = BigInt(Math.floor(price * 100));

                    // Add for SubSection DD
                    sections.push(sectionCode);
                    subSections.push(SubSectionCode.DD);
                    priceValues.push(priceCents);

                    // Add for SubSection FF
                    sections.push(sectionCode);
                    subSections.push(SubSectionCode.FF);
                    priceValues.push(priceCents);
                }
            });

            if (sections.length === 0) {
                alert("No hay precios configurados para actualizar.");
                return;
            }

            writeContract({
                address: contractAddress,
                abi: TICKETPASS_ABI,
                functionName: 'setEventPricesMXN',
                args: [eventId, sections, subSections, priceValues],
            });

        } catch (e: any) {
            alert("Error preparing transaction: " + e.message);
        }
    };



    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                Administrador de Precios por Evento
            </h3>

            {/* Exchange Rate Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Tipo de Cambio (MXN/USD)</h3>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div>
                        <strong>Actual en Contrato:</strong> {currentRate ? `$${currentRate} MXN = 1 USD` : 'Cargando...'}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            placeholder="Ej. 20.50"
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button
                            onClick={handleFetchRate}
                            disabled={isFetchingRate}
                            style={{ padding: '0.5rem', cursor: 'pointer' }}
                        >
                            {isFetchingRate ? 'Buscando...' : 'Obtener de API'}
                        </button>
                        <button
                            onClick={handleUpdateRate}
                            disabled={isPending}
                            style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Actualizar Tasa
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold', marginRight: '1rem', display: 'block', marginBottom: '0.5rem' }}>
                    1. Seleccionar Recinto:
                </label>
                <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', width: '100%', maxWidth: '400px', border: '1px solid #ccc' }}
                >
                    <option value="">-- Selecciona un Recinto --</option>
                    {venues.map(venue => (
                        <option key={venue} value={venue}>{venue}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', marginRight: '1rem', display: 'block', marginBottom: '0.5rem' }}>
                    2. Seleccionar Evento:
                </label>
                <select
                    value={eventId || ""}
                    onChange={(e) => setEventId(Number(e.target.value))}
                    disabled={!selectedVenue}
                    style={{ padding: '0.5rem', borderRadius: '4px', width: '100%', maxWidth: '400px', border: '1px solid #ccc' }}
                >
                    <option value="">-- Selecciona un Evento --</option>
                    {filteredEvents.map(ep => (
                        <option key={ep.eventId} value={ep.eventId}>
                            {ep.eventName ? `${ep.eventName} (ID: ${ep.eventId})` : `Evento ${ep.eventId}`}
                        </option>
                    ))}
                </select>
            </div>

            {eventId && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        {sectionKeys.map(key => (
                            <div key={key} style={{ background: 'white', padding: '1rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#555', marginBottom: '0.3rem' }}>
                                    {key.replace('_', ' ')}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '0.5rem', color: '#888' }}>$</span>
                                    <input
                                        type="number"
                                        value={prices[key] || ''}
                                        onChange={(e) => handlePriceChange(key, e.target.value)}
                                        style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                        placeholder="0.00"
                                    />
                                    <span style={{ marginLeft: '0.5rem', color: '#888', fontSize: '0.8rem' }}>MXN</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', color: '#0d47a1' }}>
                        ℹ️ <strong>Nota:</strong> Al actualizar, el precio se aplicará automáticamente a ambas sub-secciones (DD y FF) de cada sector.
                    </div>

                    <button
                        onClick={handleBulkUpdate}
                        disabled={isPending || isConfirming}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: isPending || isConfirming ? '#ccc' : '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        {isPending ? 'Confirmando en Wallet...' : isConfirming ? 'Procesando Transacción...' : 'Actualizar TODOS los Precios'}
                    </button>
                </>
            )}

            {isConfirmed && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', textAlign: 'center' }}>
                    ✅ ¡Precios actualizados correctamente!
                </div>
            )}
            {txHash && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}>
                    Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash.slice(0, 20)}...</a>
                </div>
            )}
        </div>
    );
};

export default BulkPriceEditor;
