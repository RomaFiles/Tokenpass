import React, { useState } from 'react';
import { useReadContracts } from 'wagmi';
import { Section } from './ForoBocaEventPage';
import { CONTRACT_ADDRESS, TICKETPASS_ABI, SectionCode, SubSectionCode, encodeSeatId, mapSectionToCode } from '../lib/contracts';

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

    // Generate seats for Left and Right sides within the subsection
    // Left Side: Seats 1-25
    // Right Side: Seats 26-50
    const generateSeats = () => {
        const rows = 5;
        const cols = 5; // 5x5 = 25 seats per side

        const leftSeats = [];
        const rightSeats = [];

        // Left Side (1-25)
        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                const number = ((r - 1) * cols) + c;
                leftSeats.push({
                    id: `L-${r}-${c}`,
                    row: r,
                    number: number,
                    side: 'Izquierda'
                });
            }
        }

        // Right Side (26-50) - Offset by 25 to keep them distinct
        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                const number = 25 + ((r - 1) * cols) + c;
                rightSeats.push({
                    id: `R-${r}-${c}`,
                    row: r,
                    number: number,
                    side: 'Derecha'
                });
            }
        }

        return { leftSeats, rightSeats };
    };

    const { leftSeats, rightSeats } = React.useMemo(() => generateSeats(), []);
    const allSeats = [...leftSeats, ...rightSeats];

    const sectionCode: SectionCode = mapSectionToCode(section);
    const subCode: SubSectionCode = subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;

    const seatIds = allSeats.map((s) => encodeSeatId(eventId, sectionCode, subCode, s.row, s.number));

    const { data: soldResults } = useReadContracts({
        contracts: seatIds.map((id) => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: TICKETPASS_ABI,
            functionName: 'soldSeats',
            args: [id],
        })),
        query: { enabled: showSeats },
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

    const renderGrid = (seats: typeof leftSeats, title: string, offsetIndex: number) => (
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h4>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
            }}>
                {seats.map((seat, i) => {
                    // Adjust index for soldResults based on whether it's left (0-24) or right (25-49)
                    const resultIndex = offsetIndex + i;
                    const isSold = !!soldResults?.[resultIndex]?.result;

                    return (
                        <button
                            key={seat.id}
                            disabled={isSold}
                            onClick={() => toggleSeat(seat.id)}
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '4px',
                                border: 'none',
                                background: isSold
                                    ? '#e0e0e0'
                                    : selectedSeats.includes(seat.id)
                                        ? '#4CAF50'
                                        : '#1976D2',
                                cursor: isSold ? 'not-allowed' : 'pointer',
                                color: 'white',
                                fontSize: '0.7rem'
                            }}
                            title={`Fila ${seat.row} Asiento ${seat.number}`}
                        >
                            {selectedSeats.includes(seat.id) ? '✓' : seat.number}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '1rem' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
                ← Seleccionar otra sección
            </button>

            <h2 style={{ marginBottom: '1.5rem' }}>{section.replace('_', ' ')} - Sección {subSection}</h2>

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

                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {renderGrid(leftSeats, "Izquierda", 0)}
                        {renderGrid(rightSeats, "Derecha", leftSeats.length)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
