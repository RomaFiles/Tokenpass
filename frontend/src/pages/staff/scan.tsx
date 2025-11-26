import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, TICKETPASS_ABI, decodeSeatId, SectionCode, SubSectionCode } from '../../lib/contracts';
import Head from 'next/head';
import Link from 'next/link';

const StaffScanPage = () => {
    const [data, setData] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid' | 'used'>('idle');
    const [verificationMessage, setVerificationMessage] = useState<string>('');
    const [scannedDetails, setScannedDetails] = useState<any>(null);
    const [checkedInTokens, setCheckedInTokens] = useState<string[]>([]);
    const publicClient = usePublicClient();

    useEffect(() => {
        const stored = localStorage.getItem('checkedInTokens');
        if (stored) {
            setCheckedInTokens(JSON.parse(stored));
        }
    }, []);

    const handleScan = (text: string) => {
        if (text && text !== data) {
            setData(text);
            verifyTicket(text);
        }
    };

    const verifyTicket = async (qrData: string) => {
        setVerificationStatus('verifying');
        setVerificationMessage('Verificando en blockchain...');
        setScannedDetails(null);

        try {
            const parsed = JSON.parse(qrData);
            // TicketQR.tsx uses short keys: t (tokenId), s (seatId), o (owner)
            const tokenId = parsed.t || parsed.tokenId;
            const seatId = parsed.s || parsed.seatId;
            const claimedOwner = parsed.o || parsed.owner;

            if (!tokenId || !seatId || !claimedOwner) {
                throw new Error(`Datos faltantes. Recibido: ${JSON.stringify(parsed)}`);
            }

            // Decode seat details for display
            const seat = decodeSeatId(BigInt(seatId));
            const sectionName = Object.keys(SectionCode).find(key => SectionCode[key as keyof typeof SectionCode] === seat.section) || `Sección ${seat.section}`;
            const subName = seat.subSection === SubSectionCode.FF ? 'Lado FF' : 'Lado DD';

            // Extract eventId
            const eventId = Number(BigInt(seatId) >> 48n);

            const EVENTS: Record<number, { name: string; venue: string; date: string }> = {
                1: { name: "Juan Gabriel: Concierto Especial", venue: "Foro Boca", date: "Sábado 15 de Diciembre, 20:00 hrs" },
                2: { name: "Juan Gabriel: Concierto Especial", venue: "Foro Boca", date: "Domingo 16 de Diciembre, 18:00 hrs" },
            };

            const eventInfo = EVENTS[eventId] || { name: "Evento Desconocido", venue: "Ubicación Desconocida", date: "Fecha Desconocida" };

            setScannedDetails({
                tokenId,
                section: sectionName.replace(/_/g, ' '),
                subSection: subName,
                row: seat.row,
                number: seat.number,
                eventName: eventInfo.name,
                venue: eventInfo.venue,
                eventDate: eventInfo.date
            });

            // Check if already used locally
            if (checkedInTokens.includes(tokenId.toString())) {
                setVerificationStatus('used');
                setVerificationMessage('⚠️ YA INGRESÓ: Este boleto ya fue escaneado y confirmado.');
                return;
            }

            // Verify on-chain
            if (!publicClient) {
                throw new Error("Cliente RPC no disponible");
            }

            const realOwner = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: TICKETPASS_ABI,
                functionName: 'ownerOf',
                args: [BigInt(tokenId)],
            });

            if (realOwner.toLowerCase() === claimedOwner.toLowerCase()) {
                setVerificationStatus('valid');
                setVerificationMessage('ACCESO CONCEDIDO');
            } else {
                setVerificationStatus('invalid');
                setVerificationMessage(`ACCESO DENEGADO: El portador no es el dueño actual. Dueño real: ${realOwner.substring(0, 6)}...`);
            }

        } catch (e: any) {
            console.error(e);
            setVerificationStatus('invalid');
            setVerificationMessage(`Error: ${e.message}`);
        }
    };

    const confirmAttendance = () => {
        if (scannedDetails && scannedDetails.tokenId) {
            const newTokenId = scannedDetails.tokenId.toString();
            const updated = [...checkedInTokens, newTokenId];
            setCheckedInTokens(updated);
            localStorage.setItem('checkedInTokens', JSON.stringify(updated));
            setVerificationStatus('used');
            setVerificationMessage('✅ ASISTENCIA CONFIRMADA');
        }
    };

    const resetScan = () => {
        setData(null);
        setVerificationStatus('idle');
        setVerificationMessage('');
        setScannedDetails(null);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Head>
                <title>Staff Scanner | Tokenpass</title>
            </Head>

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: '#0d76fc', fontWeight: 'bold' }}>
                    &larr; Inicio
                </Link>
                <h1 style={{ margin: 0 }}>Staff Scanner</h1>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', position: 'relative' }}>
                {verificationStatus === 'idle' ? (
                    <div style={{ width: '100%' }}>
                        <Scanner
                            onScan={(result) => {
                                if (result && result.length > 0) {
                                    handleScan(result[0].rawValue);
                                }
                            }}
                            onError={(error) => console.log(error)}
                            constraints={{ facingMode: 'environment' }}
                        />
                    </div>
                ) : (
                    <div style={{ padding: '4rem 2rem', color: 'white' }}>
                        <p>Escaneo Pausado</p>
                        <button
                            onClick={resetScan}
                            style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: 'white', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Escanear Nuevo
                        </button>
                    </div>
                )}
            </div>

            {verificationStatus !== 'idle' && (
                <div style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    background: verificationStatus === 'valid' ? '#e8f5e9' : verificationStatus === 'invalid' ? '#ffebee' : verificationStatus === 'used' ? '#fff3e0' : '#f5f5f5',
                    border: `2px solid ${verificationStatus === 'valid' ? '#4caf50' : verificationStatus === 'invalid' ? '#f44336' : verificationStatus === 'used' ? '#ff9800' : '#ccc'}`
                }}>
                    <h2 style={{
                        color: verificationStatus === 'valid' ? '#2e7d32' : verificationStatus === 'invalid' ? '#c62828' : verificationStatus === 'used' ? '#ef6c00' : '#666',
                        fontSize: '2rem',
                        margin: '0 0 1rem 0'
                    }}>
                        {verificationStatus === 'valid' ? '✅ VÁLIDO' : verificationStatus === 'invalid' ? '❌ INVÁLIDO' : verificationStatus === 'used' ? '⚠️ YA INGRESÓ' : '⏳ Verificando...'}
                    </h2>

                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{verificationMessage}</p>

                    {scannedDetails && (
                        <div style={{ marginTop: '1.5rem', textAlign: 'left', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                            <p><strong>Evento:</strong> {scannedDetails.eventName}</p>
                            <p><strong>Recinto:</strong> {scannedDetails.venue}</p>
                            <p><strong>Fecha:</strong> {scannedDetails.eventDate}</p>
                            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <p><strong>Sección:</strong> {scannedDetails.section}</p>
                            <p><strong>Ubicación:</strong> {scannedDetails.subSection}</p>
                            <p><strong>Asiento:</strong> Fila {scannedDetails.row} - {scannedDetails.number}</p>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>Token ID: {scannedDetails.tokenId}</p>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {verificationStatus === 'valid' && (
                            <button
                                onClick={confirmAttendance}
                                style={{
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    background: '#2e7d32',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Confirmar Asistencia
                            </button>
                        )}

                        <button
                            onClick={resetScan}
                            style={{
                                padding: '1rem',
                                fontSize: '1.1rem',
                                background: '#0d76fc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Escanear Nuevo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffScanPage;
