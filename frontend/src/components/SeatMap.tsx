import React from 'react';
import { Section } from './ForoBocaEventPage';

interface SeatMapProps {
    onSelectSection: (section: Section) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ onSelectSection }) => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem' }}>Escenario</h3>
            <div style={{ background: 'black', width: '60%', height: '80px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                ESCENARIO
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', gap: '1rem', width: '100%', maxWidth: '800px' }}>
                {/* Left Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <SectionBox label="CORO LAT FF" color="#C4C4C4" onClick={() => onSelectSection('CORO_LATERAL')} vertical />
                    <SectionBox label="PALCO LAT FF" color="#D81B60" onClick={() => onSelectSection('PALCO')} vertical />
                    <SectionBox label="PLATEA BAJA LAT FF" color="#F48FB1" onClick={() => onSelectSection('PLATEA_BAJA')} vertical />
                </div>

                {/* Center */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <SectionBox label="LUNETA BAJA FF" color="#1976D2" onClick={() => onSelectSection('LUNETA_BAJA')} />
                        <SectionBox label="LUNETA BAJA DD" color="#1976D2" onClick={() => onSelectSection('LUNETA_BAJA')} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <SectionBox label="LUNETA ALTA FF" color="#388E3C" onClick={() => onSelectSection('LUNETA_ALTA')} />
                        <SectionBox label="LUNETA ALTA DD" color="#388E3C" onClick={() => onSelectSection('LUNETA_ALTA')} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <SectionBox label="PLATEA BAJA FF" color="#FB8C00" onClick={() => onSelectSection('PLATEA_BAJA')} />
                        <SectionBox label="PLATEA BAJA DD" color="#FB8C00" onClick={() => onSelectSection('PLATEA_BAJA')} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <SectionBox label="PLATEA ALTA FF" color="#7B1FA2" onClick={() => onSelectSection('PLATEA_ALTA')} />
                        <SectionBox label="PLATEA ALTA DD" color="#7B1FA2" onClick={() => onSelectSection('PLATEA_ALTA')} />
                    </div>
                </div>

                {/* Right Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <SectionBox label="CORO LAT DD" color="#C4C4C4" onClick={() => onSelectSection('CORO_LATERAL')} vertical />
                    <SectionBox label="PALCO LAT DD" color="#D81B60" onClick={() => onSelectSection('PALCO')} vertical />
                    <SectionBox label="PLATEA BAJA LAT DD" color="#F48FB1" onClick={() => onSelectSection('PLATEA_BAJA')} vertical />
                </div>
            </div>
        </div>
    );
};

const SectionBox = ({ label, color, onClick, vertical = false }: { label: string, color: string, onClick: () => void, vertical?: boolean }) => (
    <div
        onClick={onClick}
        style={{
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            textAlign: 'center',
            width: '100%',
            height: vertical ? '150px' : '100px',
            writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
            transform: vertical ? 'rotate(180deg)' : 'none',
            transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
        {label}
    </div>
);

export default SeatMap;
