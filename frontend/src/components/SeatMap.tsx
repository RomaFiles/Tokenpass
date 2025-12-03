import React from 'react';
import { Section } from './ForoBocaEventPage';

interface SeatMapProps {
    onSelectSection: (section: Section, subSection?: 'FF' | 'DD') => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ onSelectSection }) => {
    const [zoom, setZoom] = React.useState(1);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -e.deltaY * 0.005;
            setZoom(prev => Math.min(Math.max(prev + delta, 1), 3));
        };

        container.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, []);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 1));
    const handleResetZoom = () => setZoom(1);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

            {/* Zoom Controls */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 10 }}>
                <button onClick={handleResetZoom} style={zoomButtonStyle}>↻</button>
                <button onClick={handleZoomIn} style={zoomButtonStyle}>+</button>
                <button onClick={handleZoomOut} style={zoomButtonStyle}>-</button>
            </div>

            <div style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '1rem'
            }}>
                {/* Top Bar: CORO */}
                <div style={{ display: 'flex', width: '50%', maxWidth: '400px', height: '25px', gap: '2px', marginBottom: '10px' }}>
                    <SectionBox label="CORO FF" color="#B0BEC5" onClick={() => onSelectSection('CORO', 'FF')} style={{ height: '100%', fontSize: '0.6rem', padding: 0 }} />
                    <SectionBox label="CORO DD" color="#B0BEC5" onClick={() => onSelectSection('CORO', 'DD')} style={{ height: '100%', fontSize: '0.6rem', padding: 0 }} />
                </div>

                {/* Stage */}
                <div style={{
                    background: 'black',
                    width: '65%',
                    maxWidth: '550px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    marginBottom: '1rem'
                }}>
                    Escenario
                </div>

                {/* Main Body Container */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%', maxWidth: '800px', height: 'auto' }}>

                    {/* Left Column Group */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', width: '15%' }}>
                        {/* Top Left: Coro Lat + Palco Lat */}
                        <div style={{ display: 'flex', gap: '5px', height: '180px', width: '100%' }}>
                            <SectionBox label="CORO LAT FF" color="#B0BEC5" onClick={() => onSelectSection('CORO_LATERAL', 'FF')} vertical style={{ width: '50%', height: '100%', fontSize: '0.6rem', marginTop: '-110px' }} />
                            <SectionBox label="PALCO LAT FF" color="#D81B60" onClick={() => onSelectSection('PALCO', 'FF')} vertical style={{ width: '50%', height: '100%', fontSize: '0.6rem', marginTop: '-70px' }} />
                        </div>
                        {/* Bottom Left: Platea Baja Lat */}
                        <div style={{ height: '180px', width: '50%', marginTop: '-50px', marginRight: '80px' }}>
                            <SectionBox label="PLATEA BAJA LAT FF" color="#FB8C00" onClick={() => onSelectSection('PLATEA_BAJA', 'FF')} vertical style={{ width: '100%', height: '100%', fontSize: '0.6rem' }} />
                        </div>
                    </div>

                    {/* Center Column Group */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '60%' }}>

                        {/* Luneta Baja */}
                        <div style={{ display: 'flex', height: '180px', gap: '2px' }}>
                            <SectionBox label="LUNETA BAJA FF" color="#1976D2" onClick={() => onSelectSection('LUNETA_BAJA', 'FF')} style={{ height: '100%' }} />
                            <SectionBox label="LUNETA BAJA DD" color="#1976D2" onClick={() => onSelectSection('LUNETA_BAJA', 'DD')} style={{ height: '100%' }} />
                        </div>

                        {/* Luneta Alta */}
                        <div style={{ display: 'flex', height: '130px', gap: '2px', marginTop: '10px', width: '130%', alignSelf: 'center' }}>
                            <SectionBox label="LUNETA ALTA FF" color="#388E3C" onClick={() => onSelectSection('LUNETA_ALTA', 'FF')} style={{ height: '100%' }} />
                            <SectionBox label="LUNETA ALTA DD" color="#388E3C" onClick={() => onSelectSection('LUNETA_ALTA', 'DD')} style={{ height: '100%' }} />
                        </div>

                        {/* Platea Baja */}
                        <div style={{ display: 'flex', height: '50px', gap: '60px', width: '130%', alignSelf: 'center', zIndex: 1 }}>
                            <SectionBox label="PLATEA BAJA FF" color="#FB8C00" onClick={() => onSelectSection('PLATEA_BAJA', 'FF')} style={{ height: '100%' }} />
                            <SectionBox label="PLATEA BAJA DD" color="#FB8C00" onClick={() => onSelectSection('PLATEA_BAJA', 'DD')} style={{ height: '100%' }} />
                        </div>

                        {/* Platea Alta */}
                        <div style={{ display: 'flex', height: '50px', gap: '2px', justifyContent: 'center', marginTop: '5px' }}>
                            <div style={{ width: '80%', display: 'flex', gap: '2px' }}>
                                <SectionBox label="PLATEA ALTA FF" color="#7B1FA2" onClick={() => onSelectSection('PLATEA_ALTA', 'FF')} style={{ height: '100%' }} />
                                <SectionBox label="PLATEA ALTA DD" color="#7B1FA2" onClick={() => onSelectSection('PLATEA_ALTA', 'DD')} style={{ height: '100%' }} />
                            </div>
                        </div>

                    </div>

                    {/* Right Column Group */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', width: '15%' }}>
                        {/* Top Right: Palco Lat + Coro Lat */}
                        <div style={{ display: 'flex', gap: '5px', height: '180px', width: '100%' }}>
                            <SectionBox label="PALCO LAT DD" color="#D81B60" onClick={() => onSelectSection('PALCO', 'DD')} vertical style={{ width: '50%', height: '100%', fontSize: '0.6rem', marginTop: '-70px' }} />
                            <SectionBox label="CORO LAT DD" color="#B0BEC5" onClick={() => onSelectSection('CORO_LATERAL', 'DD')} vertical style={{ width: '50%', height: '100%', fontSize: '0.6rem', marginTop: '-110px' }} />
                        </div>
                        {/* Bottom Right: Platea Baja Lat */}
                        <div style={{ height: '180px', width: '50%', marginTop: '-50px', marginLeft: '80px' }}>
                            <SectionBox label="PLATEA BAJA LAT DD" color="#FB8C00" onClick={() => onSelectSection('PLATEA_BAJA', 'DD')} vertical style={{ width: '100%', height: '100%', fontSize: '0.6rem' }} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const zoomButtonStyle = {
    width: '24px',
    height: '24px',
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    fontSize: '12px'
};

const SectionBox = ({ label, color, onClick, vertical = false, style }: { label: string, color: string, onClick: () => void, vertical?: boolean, style?: React.CSSProperties }) => (
    <div
        onClick={onClick}
        style={{
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            cursor: 'pointer',
            borderRadius: '2px',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            textAlign: 'center',
            width: '100%',
            height: vertical ? '150px' : '100px',
            writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
            transform: vertical ? 'rotate(180deg)' : 'none',
            transition: 'opacity 0.2s',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            ...style
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
        {label}
    </div>
);

export default SeatMap;
