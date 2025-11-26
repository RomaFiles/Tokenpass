import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI } from '../lib/contracts';
import styles from '../styles/App.module.css';

const SEPOLIA_ID = 11155111;

const Navigation: React.FC = () => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];

    const { data: ownerAddress } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'owner',
    });

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const HARDCODED_ADMIN = "0x49c2D5C3B43d6ff2e1792CB6137f90B3d587b741".toLowerCase();
        if (address) {
            const isContractOwner = ownerAddress?.toLowerCase() === address.toLowerCase();
            const isHardcodedAdmin = address.toLowerCase() === HARDCODED_ADMIN;
            setIsAdmin(isContractOwner || isHardcodedAdmin);
        } else {
            setIsAdmin(false);
        }
    }, [ownerAddress, address]);

    return (
        <div className={styles.connectButtonContainer} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isConnected && (
                <Link href="/tickets" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                }}>
                    My Tickets
                </Link>
            )}

            {isAdmin && (
                <>
                    <Link href="/admin" style={{
                        color: '#ff9800',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        Admin
                    </Link>
                    <Link href="/staff/scan" style={{
                        color: '#ff9800',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        Staff
                    </Link>
                </>
            )}

            <ConnectButton />
        </div>
    );
};

export default Navigation;
