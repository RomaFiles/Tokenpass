import React from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface TicketSummaryProps {
    selectedSeats: any[];
}

const TicketSummary: React.FC<TicketSummaryProps> = ({ selectedSeats }) => {
    const { isConnected } = useAccount();
    const { sendTransaction } = useSendTransaction();

    const getPrice = (section: string) => {
        // Mock pricing logic
        if (section.includes('LUNETA_ALTA')) return 309;
        if (section.includes('LUNETA_BAJA')) return 398;
        return 265;
    };

    const total = selectedSeats.reduce((acc, seat) => acc + getPrice(seat.section), 0);

    const handlePayment = () => {
        if (!isConnected) return;

        // Convert total to a small ETH amount for testing/demo purposes
        // In a real app, this would be the actual price or a token transfer
        // For now, we'll send 0.0001 ETH per dollar to simulate a payment
        const ethAmount = (total * 0.000001).toFixed(18);

        sendTransaction({
            to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth as placeholder
            value: parseEther(ethAmount),
        });
    };

    return (
        <div>
            {selectedSeats.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    Selecciona tus asientos en el mapa para continuar
                </div>
            ) : (
                <div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {selectedSeats.map((seat, idx) => (
                            <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{seat.section.replace('_', ' ')} {seat.subSection}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Fila {seat.row} - Asiento {seat.number}</div>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    ${getPrice(seat.section)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${total}</span>
                        </div>

                        {!isConnected ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ConnectButton />
                            </div>
                        ) : (
                            <button
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#6200ea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                onClick={handlePayment}
                            >
                                Pagar con MetaMask
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSummary;
