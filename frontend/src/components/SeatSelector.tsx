import React, { useState } from 'react';
import { useReadContracts } from 'wagmi';
import { Section } from './ForoBocaEventPage';
import { CONTRACT_ADDRESS, TICKETPASS_ABI, SectionCode, SubSectionCode, encodeSeatId, mapSectionToCode, getRowNumber } from '../lib/contracts';

import { getSeatLayout, ZoneLayout } from '../data/seatLayouts';

interface SeatSelectorProps {
    eventId: number;
    section: Section;
    initialSubSection: 'FF' | 'DD'; // Must be provided now
    onBack: () => void;
    onSeatsChange: (seats: any[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ eventId, section, initialSubSection, onBack, onSeatsChange }) => {
    // We lock the subsection to what was clicked on the map
    const subSection = initialSubSection;

    const [quantity, setQuantity] = useState(1);
    const [showSeats, setShowSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const layout = React.useMemo(() => getSeatLayout(section, subSection), [section, subSection]);

    // Flatten seats for contract calls and selection logic
    const allSeats = React.useMemo(() => {
        if (!layout) return [];
        const flat: any[] = [];
        layout.rows.forEach(row => {
            row.seats.forEach(num => {
                flat.push({
                    id: `${row.name}-${num}`,
                    row: row.name, // Use string name for row (A, B, C...)
                    number: num,
                    fullLabel: `${row.name}-${num}`
                });
            });
        });
        return flat;
    }, [layout]);

    const sectionCode: SectionCode = mapSectionToCode(section);
    const subCode: SubSectionCode = subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;

    const seatIds = allSeats.map((s) => encodeSeatId(eventId, sectionCode, subCode, getRowNumber(s.row), s.number));

    const { data: soldResults } = useReadContracts({
        contracts: seatIds.map((id) => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: TICKETPASS_ABI,
            functionName: 'soldSeats',
            args: [id],
        })),
        query: { enabled: showSeats && !!layout },
    });

    const handleSearch = () => {
        setShowSeats(true);
        setSelectedSeats([]);
        onSeatsChange([]);
    };

    const toggleSeat = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            const newSelection = selectedSeats.filter(id => id !== seatId);
            setSelectedSeats(newSelection);
            onSeatsChange(newSelection.map(id => {
                const s = allSeats.find(x => x.id === id);
                return { ...s, section, subSection };
            }));
        } else {
            if (selectedSeats.length < quantity) {
                const newSelection = [...selectedSeats, seatId];
                setSelectedSeats(newSelection);
                onSeatsChange(newSelection.map(id => {
                    const s = allSeats.find(x => x.id === id);
                    return { ...s, section, subSection };
                }));
            }
        }
    };

    if (!layout) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Layout not available for this section yet.</h3>
                <button onClick={onBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
                ← Seleccionar otra sección
            </button>

            <h2 style={{ marginBottom: '1.5rem' }}>{section.replace('_', ' ')} - {subSection === 'FF' ? 'Izquierda (FF)' : 'Derecha (DD)'}</h2>

            {!showSeats ? (
                <div style={{ maxWidth: '400px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cantidad de boletos</label>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: '#6200ea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Ver Asientos
                    </button>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Selecciona tus asientos ({selectedSeats.length}/{quantity})</h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e0e0e0' }}></div> Ocupado</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#1976D2' }}></div> Disponible</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4CAF50' }}></div> Seleccionado</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'center',
                        overflowX: 'auto',
                        padding: '1rem'
                    }}>
                        {layout.rows.map((row) => (
                            <div key={row.name} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ width: '20px', fontWeight: 'bold', textAlign: 'right', marginRight: '0.5rem' }}>{row.name}</span>
                                {row.seats.map((seatNum) => {
                                    // Find index in allSeats to get sold status
                                    const seatIndex = allSeats.findIndex(s => s.row === row.name && s.number === seatNum);
                                    const isSold = !!soldResults?.[seatIndex]?.result;
                                    const seatId = `${row.name}-${seatNum}`;

                                    return (
                                        <button
                                            key={seatNum}
                                            disabled={isSold}
                                            onClick={() => toggleSeat(seatId)}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: isSold
                                                    ? '#e0e0e0'
                                                    : selectedSeats.includes(seatId)
                                                        ? '#4CAF50'
                                                        : '#1976D2',
                                                cursor: isSold ? 'not-allowed' : 'pointer',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            title={`Fila ${row.name} Asiento ${seatNum}`}
                                        >
                                            {selectedSeats.includes(seatId) ? '✓' : seatNum}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
