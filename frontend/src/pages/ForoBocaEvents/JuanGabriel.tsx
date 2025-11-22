import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/ForoBoca.module.css";
import SeatMap from "../../components/SeatMap";
import SeatSelector from "../../components/SeatSelector";
import TicketSummary from "../../components/TicketSummary";

export type Section = "CORO" | "CORO_LATERAL" | "LUNETA_ALTA" | "LUNETA_BAJA" | "PALCO" | "PLATEA_ALTA" | "PLATEA_BAJA";

const JuanGabriel: NextPage = () => {
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

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
                    <Link href="/ForoBoca" className={styles.backLink} style={{ marginBottom: '1rem', display: 'block' }}>
                        ← Volver a eventos
                    </Link>

                    <div style={{ background: '#e0e7ef', padding: '2rem', borderRadius: '8px', minHeight: '600px', position: 'relative' }}>
                        {!selectedSection ? (
                            <SeatMap onSelectSection={setSelectedSection} />
                        ) : (
                            <SeatSelector
                                section={selectedSection}
                                onBack={() => setSelectedSection(null)}
                                onSeatsChange={setSelectedSeats}
                            />
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        {selectedSection ? `Sección: ${selectedSection.replace('_', ' ')}` : 'Seleccionar sector'}
                    </h2>

                    {!selectedSection ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <SectionPrice label="CORO" price={265} />
                            <SectionPrice label="CORO LATERAL" price={265} />
                            <SectionPrice label="LUNETA ALTA" price={309} />
                            <SectionPrice label="LUNETA BAJA" price={398} />
                            <SectionPrice label="PALCO" price={398} />
                        </div>
                    ) : (
                        <TicketSummary selectedSeats={selectedSeats} />
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
