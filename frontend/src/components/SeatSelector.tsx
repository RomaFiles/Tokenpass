import React, { useState } from 'react';
import { useReadContracts } from 'wagmi';
import { Section } from './ForoBocaEventPage';
import { CONTRACT_ADDRESS, TICKETPASS_ABI, SectionCode, SubSectionCode, encodeSeatId, mapSectionToCode } from '../lib/contracts';

interface SeatSelectorProps {
    eventId: number;
    section: Section;
    onBack: () => void;
    onSeatsChange: (seats: any[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ eventId, section, onBack, onSeatsChange }) => {
    const [subSection, setSubSection] = useState<'DD' | 'FF' | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [showSeats, setShowSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // Generate seats (rows/cols)
    const generateSeats = () => {
        const rows = 5;
        const cols = 10;
        const seats = [];
        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                seats.push({
                    id: `${r}-${c}`,
                    row: r,
                    number: c,
                });
            }
        }
        return seats;
    };

    const [seats] = useState(generateSeats());

    const sectionCode: SectionCode = mapSectionToCode(section);
    const subCode: SubSectionCode = subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;

    const seatIds = seats.map((s) => encodeSeatId(eventId, sectionCode, subCode, s.row, s.number));

    const { data: soldResults } = useReadContracts({
        contracts: seatIds.map((id) => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: TICKETPASS_ABI,
            functionName: 'soldSeats',
            args: [id],
        })),
        query: { enabled: !!subSection && showSeats },
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
                const s = seats.find(x => x.id === id);
                return { ...s, section, subSection };
            }));
        } else {
            if (selectedSeats.length < quantity) {
                const newSelection = [...selectedSeats, seatId];
                setSelectedSeats(newSelection);
                onSeatsChange(newSelection.map(id => {
                    const s = seats.find(x => x.id === id);
                    return { ...s, section, subSection };
                }));
            }
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
                ← Seleccionar otra sección
            </button>

            <h2 style={{ marginBottom: '1.5rem' }}>{section.replace('_', ' ')}</h2>

            {!showSeats ? (
                <div style={{ maxWidth: '400px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sub-sección</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setSubSection('FF')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    border: subSection === 'FF' ? '2px solid #6200ea' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: subSection === 'FF' ? '#f3e5f5' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Lado FF (Izquierda)
                            </button>
                            <button
                                onClick={() => setSubSection('DD')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    border: subSection === 'DD' ? '2px solid #6200ea' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: subSection === 'DD' ? '#f3e5f5' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Lado DD (Derecha)
                            </button>
                        </div>
                    </div>

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
                        disabled={!subSection}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: subSection ? '#6200ea' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: subSection ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold'
                        }}
                    >
                        Buscar boletos
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
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gap: '0.5rem',
                        maxWidth: '500px',
                        margin: '0 auto',
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px'
                    }}>
                        {seats.map((seat, index) => {
                            const isSold = !!soldResults?.[index]?.result;
                            return (
                                <button
                                    key={seat.id}
                                    disabled={isSold}
                                    onClick={() => toggleSeat(seat.id)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
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
                                    {selectedSeats.includes(seat.id) && '✓'}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
