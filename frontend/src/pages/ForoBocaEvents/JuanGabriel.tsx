import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/ForoBoca.module.css";
import SeatMap from "../../components/SeatMap";
import SeatSelector from "../../components/SeatSelector";
import TicketSummary from "../../components/TicketSummary";

export type Section = "CORO" | "CORO_LATERAL" | "LUNETA_ALTA" | "LUNETA_BAJA" | "PALCO" | "PLATEA_ALTA" | "PLATEA_BAJA";

// Define available events/dates
const EVENTS = [
    { id: 1, date: "Sábado 15 de Diciembre, 20:00 hrs" },
    { id: 2, date: "Domingo 16 de Diciembre, 18:00 hrs" },
];

const JuanGabriel: NextPage = () => {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

    const handleBack = () => {
        if (selectedSection) {
            setSelectedSection(null);
            setSelectedSeats([]);
        } else {
            setSelectedEventId(null);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Juan Gabriel | Concierto Especial - Foro Boca</title>
            </Head>

            <header className={styles.header} style={{ height: '200px' }}>
                <div className={styles.headerOverlay}></div>
                <div className={styles.headerContent}>
                    <h1 className={styles.title} style={{ fontSize: '2.5rem' }}>Juan Gabriel</h1>
                    <h2 className={styles.subtitle} style={{ fontSize: '1.5rem' }}>Concierto Especial</h2>
                </div>
            </header>

            <div className={styles.content} style={{ display: 'flex', gap: '2rem', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <Link href="/ForoBoca" className={styles.backLink}>
                            ← Volver a eventos
                        </Link>
                        {(selectedEventId || selectedSection) && (
                            <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                                ← Volver atrás
                            </button>
                        )}
                    </div>

                    <div style={{ background: '#e0e7ef', padding: '2rem', borderRadius: '8px', minHeight: '600px', position: 'relative' }}>
                        {!selectedEventId ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <h2 style={{ marginBottom: '2rem', color: '#333' }}>Selecciona una fecha</h2>
                                <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                                    {EVENTS.map(ev => (
                                        <button
                                            key={ev.id}
                                            onClick={() => setSelectedEventId(ev.id)}
                                            style={{
                                                padding: '1.5rem',
                                                fontSize: '1.2rem',
                                                background: 'white',
                                                border: '2px solid #0d76fc',
                                                borderRadius: '8px',
                                                color: '#0d76fc',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {ev.date}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : !selectedSection ? (
                            <SeatMap onSelectSection={setSelectedSection} />
                        ) : (
                            <SeatSelector
                                eventId={selectedEventId}
                                section={selectedSection}
                                onBack={() => setSelectedSection(null)}
                                onSeatsChange={setSelectedSeats}
                            />
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        {selectedEventId
                            ? EVENTS.find(e => e.id === selectedEventId)?.date
                            : 'Selecciona fecha'}
                    </h2>

                    {selectedEventId && (
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
                            {selectedSection ? `Sección: ${selectedSection.replace('_', ' ')}` : 'Selecciona sector'}
                        </h3>
                    )}

                    {!selectedSection ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <SectionPrice label="CORO" price={265} />
                            <SectionPrice label="CORO LATERAL" price={265} />
                            <SectionPrice label="LUNETA ALTA" price={309} />
                            <SectionPrice label="LUNETA BAJA" price={398} />
                            <SectionPrice label="PALCO" price={398} />
                        </div>
                    ) : (
                        <TicketSummary eventId={selectedEventId!} selectedSeats={selectedSeats} />
                    )}
                </div>
            </div>
        </div>
    );
};

const SectionPrice = ({ label, price }: { label: string, price: number }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
        <span style={{ fontWeight: 'bold' }}>{label}</span>
        <span>Desde ${price}</span>
    </div>
);

export default JuanGabriel;
