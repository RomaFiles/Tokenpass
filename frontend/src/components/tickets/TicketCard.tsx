import React, { useState } from 'react';
import { decodeSeatId, SectionCode, SubSectionCode } from '../../lib/contracts';
import TicketQR from './TicketQR';
import TransferModal from './TransferModal';

interface TicketCardProps {
    tokenId: bigint;
    seatId: bigint;
    owner: string;
    onTransferSuccess: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ tokenId, seatId, owner, onTransferSuccess }) => {
    const [showQR, setShowQR] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);

    const seat = decodeSeatId(seatId);

    // Extract eventId from the seatId (top 16 bits)
    // seatId is BigInt, so we shift right by 48 bits (16+8+8+16 = 48? No, let's check decodeSeatId logic or just shift)
    // Actually, decodeSeatId might not return eventId. Let's check contracts.ts.
    // If not, we can manually extract it: eventId = Number(seatId >> 48n)
    const eventId = Number(seatId >> 48n);

    // Map codes back to strings for display
    const sectionName = Object.keys(SectionCode).find(key => SectionCode[key as keyof typeof SectionCode] === seat.section) || `Sección ${seat.section}`;
    const subName = seat.subSection === SubSectionCode.FF ? 'Lado FF (Izquierda)' : 'Lado DD (Derecha)';

    // Mock Event Data (In a real app, this would come from a database or contract metadata)
    const EVENTS = {
        1: { date: "Sábado 15 de Diciembre, 20:00 hrs" },
        2: { date: "Domingo 16 de Diciembre, 18:00 hrs" },
    };

    const eventDetails = {
        name: "Juan Gabriel: Concierto Especial",
        venue: "Foro Boca",
        date: EVENTS[eventId as keyof typeof EVENTS]?.date || "Fecha por confirmar",
        image: "/models/ForoBocaEvents/JuanGabrielHomenaje.png"
    };

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch'
        }}>
            {/* Event Image */}
            <div style={{ width: '120px', position: 'relative', flexShrink: 0 }}>
                <img
                    src={eventDetails.image}
                    alt={eventDetails.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Ticket Details */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#0d76fc', fontSize: '1.2rem' }}>{eventDetails.name}</h3>
                            <p style={{ margin: '0.2rem 0', color: '#666', fontSize: '0.9rem' }}>{eventDetails.venue} • {eventDetails.date}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ background: '#f0f7ff', color: '#0d76fc', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                #{tokenId.toString()}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textTransform: 'uppercase' }}>Sección</p>
                                <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>{sectionName.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textTransform: 'uppercase' }}>Ubicación</p>
                                <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>{subName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textTransform: 'uppercase' }}>Fila</p>
                                <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>{seat.row}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textTransform: 'uppercase' }}>Asiento</p>
                                <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>{seat.number}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setShowQR(!showQR)}
                        style={{ flex: 1, padding: '0.6rem', background: '#0d76fc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                    >
                        {showQR ? 'Ocultar QR' : 'Ver Código QR'}
                    </button>
                    <button
                        onClick={() => setShowTransfer(true)}
                        style={{ flex: 1, padding: '0.6rem', background: 'white', color: '#0d76fc', border: '1px solid #0d76fc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Transferir
                    </button>
                </div>

                {showQR && (
                    <div style={{ marginTop: '1rem', textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                        <TicketQR tokenId={tokenId.toString()} seatId={seatId.toString()} owner={owner} />
                        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>Muestra este código en la entrada</p>
                    </div>
                )}
            </div>

            {showTransfer && (
                <TransferModal
                    tokenId={tokenId}
                    onClose={() => setShowTransfer(false)}
                    onSuccess={onTransferSuccess}
                />
            )}
        </div>
    );
};

export default TicketCard;
