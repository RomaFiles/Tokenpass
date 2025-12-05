import React, { useState, useEffect } from 'react';
import { decodeSeatId, SectionCode, SubSectionCode, getRowLetter, CONTRACT_ADDRESSES, getContractAddress } from '../../lib/contracts';
import { useChainId } from 'wagmi';
import TicketQR from './TicketQR';
import TransferModal from './TransferModal';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface TicketCardProps {
    tokenId: bigint;
    seatId: bigint;
    owner: string;
    onTransferSuccess: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ tokenId, seatId, owner, onTransferSuccess }) => {
    const [showQR, setShowQR] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [isUsed, setIsUsed] = useState(false);
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[11155111];

    useEffect(() => {
        // Check local storage for check-in status (Simulated backend)
        const checkStatus = () => {
            const stored = localStorage.getItem('checkedInTokens');
            if (stored) {
                const checkedInTokens = JSON.parse(stored);
                if (checkedInTokens.includes(tokenId.toString())) {
                    setIsUsed(true);
                }
            }
        };

        checkStatus();
        // Listen for storage events to update across tabs
        window.addEventListener('storage', checkStatus);
        return () => window.removeEventListener('storage', checkStatus);
    }, [tokenId]);

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
        1: { name: "Juan Gabriel: Concierto Especial", date: "Sábado 15 de Diciembre, 20:00 hrs", image: "/models/ForoBocaEvents/JuanGabrielHomenaje.png" },
        2: { name: "Juan Gabriel: Concierto Especial", date: "Domingo 16 de Diciembre, 18:00 hrs", image: "/models/ForoBocaEvents/JuanGabrielHomenaje.png" },
        3: { name: "Memorias en aerosol", date: "Jueves 20 de Diciembre, 19:00 hrs", image: "/models/ForoBocaEvents/MemoriasEnAerosol.png" },
        4: { name: "Daniel Sosa", date: "Viernes 21 de Diciembre, 21:00 hrs", image: "/models/ForoBocaEvents/DanielSosa.png" },
        5: { name: "Ballet Folklórico de México", date: "Sábado 22 de Diciembre, 18:00 hrs", image: "/models/ForoBocaEvents/BalletFolkloricoMexico.png" },
        6: { name: "El Cascanueces", date: "Domingo 23 de Diciembre, 17:00 hrs", image: "/models/ForoBocaEvents/ElCascanueces.png" },
        7: { name: "Concierto de Danzón", date: "Miércoles 26 de Diciembre, 20:00 hrs", image: "/models/ForoBocaEvents/Danzon.png" },
        8: { name: "Concierto Arcano", date: "Jueves 27 de Diciembre, 20:30 hrs", image: "/models/ForoBocaEvents/ConciertoArcano.png" },
        9: { name: "Concierto Navideño", date: "Viernes 28 de Diciembre, 19:00 hrs", image: "/models/ForoBocaEvents/ConciertoNavideño.png" },
        10: { name: "Einaudi & Zimmer", date: "Sábado 29 de Diciembre, 20:00 hrs", image: "/models/ForoBocaEvents/Einaudi&Zimmer.png" },
        11: { name: "Klaus", date: "Domingo 30 de Diciembre, 16:00 hrs", image: "/models/ForoBocaEvents/Klaus.png" },
        12: { name: "Le quattro Stagioni", date: "Lunes 31 de Diciembre, 18:00 hrs", image: "/models/ForoBocaEvents/LeQuattroStagioni.png" },
    };

    const eventInfo = EVENTS[eventId as keyof typeof EVENTS] || { name: "Evento Desconocido", date: "Fecha por confirmar", image: "/models/ForoBocaEvents/JuanGabrielHomenaje.png" };

    const eventDetails = {
        name: eventInfo.name,
        venue: "Foro Boca",
        date: eventInfo.date,
        image: eventInfo.image
    };

    const generatePDF = async () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [100, 200] // Vertical mobile-friendly ticket size
        });

        // Colors
        const blueColor = '#0d76fc';
        const darkColor = '#1a1a1a';

        // Header Background
        doc.setFillColor(blueColor);
        doc.rect(0, 0, 100, 40, 'F');

        // Header Text
        doc.setTextColor('#ffffff');
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text("TOKENPASS", 50, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Boleto Digital Oficial", 50, 25, { align: 'center' });

        // Event Details
        doc.setTextColor(darkColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const splitTitle = doc.splitTextToSize(eventDetails.name, 80);
        doc.text(splitTitle, 50, 50, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(eventDetails.venue, 50, 62, { align: 'center' });
        doc.text(eventDetails.date, 50, 68, { align: 'center' });

        // Seat Info Box
        doc.setDrawColor('#e0e0e0');
        doc.setFillColor('#f9f9f9');
        doc.roundedRect(10, 75, 80, 55, 3, 3, 'FD');

        // Row 1: Section & Row
        doc.setFontSize(9);
        doc.setTextColor('#666666');
        doc.text("SECCIÓN", 20, 85);
        doc.text("FILA", 60, 85);

        doc.setFontSize(12);
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text(sectionName.replace(/_/g, ' '), 20, 93);
        doc.text(getRowLetter(seat.row), 60, 93);

        // Row 2: Seat
        doc.setFontSize(9);
        doc.setTextColor('#666666');
        doc.setFont('helvetica', 'normal');
        doc.text("ASIENTO", 20, 105);

        doc.setFontSize(12);
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text(seat.number.toString(), 20, 113);

        // Row 3: ID (Full width below)
        doc.setFontSize(9);
        doc.setTextColor('#666666');
        doc.setFont('helvetica', 'normal');
        doc.text("ID DEL TICKET", 20, 122);

        doc.setFontSize(10);
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text(`#${tokenId.toString()}`, 20, 128);

        // QR Code
        try {
            const qrData = JSON.stringify({
                tokenId: tokenId.toString(),
                seatId: seatId.toString(),
                owner: owner,
                timestamp: Date.now()
            });
            const qrDataUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 1 });
            doc.addImage(qrDataUrl, 'PNG', 25, 135, 50, 50);
        } catch (err) {
            console.error("QR Generation Error", err);
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor('#999999');
        doc.setFont('helvetica', 'normal');
        doc.text("Presenta este código en la entrada.", 50, 195, { align: 'center' });

        doc.save(`ticket-${tokenId.toString()}.pdf`);
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
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                            <span style={{ background: '#f0f7ff', color: '#0d76fc', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                #{tokenId.toString()}
                            </span>
                            {isUsed ? (
                                <span style={{ background: '#fff3e0', color: '#ef6c00', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #ffe0b2' }}>
                                    Status: Usado
                                </span>
                            ) : (
                                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #c8e6c9' }}>
                                    Status: Activo
                                </span>
                            )}
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
                                <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>{getRowLetter(seat.row)}</p>
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
                    <a
                        href={`https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: 1, padding: '0.6rem', background: '#343a40', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Ver en Etherscan
                    </a>
                </div>

                <button
                    onClick={generatePDF}
                    style={{ marginTop: '1rem', width: '100%', padding: '0.8rem', background: '#6200ea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <span style={{ fontSize: '1.2rem' }}>⬇️</span> Descargar Ticket PDF
                </button>

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
