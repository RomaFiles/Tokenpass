import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI } from '../../lib/contracts';
import { useChainId, useAccount } from 'wagmi';
import { isAddress } from 'viem';

const SEPOLIA_ID = 11155111;

interface TransferModalProps {
    tokenId: bigint;
    onClose: () => void;
    onSuccess: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ tokenId, onClose, onSuccess }) => {
    const { address } = useAccount();
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];

    const [recipient, setRecipient] = useState('');

    const { writeContract, data: txHash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    const handleTransfer = () => {
        if (!isAddress(recipient)) {
            alert("Invalid address");
            return;
        }
        if (!address) return;

        writeContract({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'safeTransferFrom',
            args: [address, recipient, tokenId],
        }, {
            onSuccess: () => {
                // Wait for confirmation then close
            }
        });
    };

    if (isConfirmed) {
        return (
            <div style={modalStyle}>
                <div style={contentStyle}>
                    <h3 style={{ color: 'green' }}>Transfer Successful!</h3>
                    <p>Ticket #{tokenId.toString()} sent to {recipient.substring(0, 6)}...</p>
                    <button onClick={() => { onSuccess(); onClose(); }} style={buttonStyle}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <h3>Transfer Ticket #{tokenId.toString()}</h3>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Recipient Address (0x...)</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x123..."
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.8rem' }}>{error.message.split('\n')[0]}</div>}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} disabled={isPending || isConfirming} style={{ ...buttonStyle, background: '#ccc' }}>Cancel</button>
                    <button onClick={handleTransfer} disabled={isPending || isConfirming || !recipient} style={buttonStyle}>
                        {isPending || isConfirming ? 'Processing...' : 'Transfer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const modalStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const contentStyle: React.CSSProperties = {
    background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px'
};

const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem', background: '#6200ea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
};

export default TransferModal;
