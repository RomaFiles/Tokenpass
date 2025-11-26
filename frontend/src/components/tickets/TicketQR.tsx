import React from 'react';
import QRCode from 'react-qr-code';

interface TicketQRProps {
    tokenId: string;
    seatId: string;
    owner: string;
}

const TicketQR: React.FC<TicketQRProps> = ({ tokenId, seatId, owner }) => {
    // Simple JSON payload for now. In Phase 4 this will be signed.
    const payload = JSON.stringify({
        t: tokenId,
        s: seatId,
        o: owner,
        ts: Date.now()
    });

    return (
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', display: 'inline-block' }}>
            <QRCode value={payload} size={150} />
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#666', textAlign: 'center' }}>
                Token ID: {tokenId}
            </div>
        </div>
    );
};

export default TicketQR;
