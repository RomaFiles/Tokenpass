import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI } from '../../lib/contracts';
import { useChainId } from 'wagmi';

const SEPOLIA_ID = 11155111;

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];

    const { data: ownerAddress, isLoading } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'owner',
    });

    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const HARDCODED_ADMIN = "0x49c2D5C3B43d6ff2e1792CB6137f90B3d587b741".toLowerCase();
        if (address) {
            const isContractOwner = ownerAddress?.toLowerCase() === address.toLowerCase();
            const isHardcodedAdmin = address.toLowerCase() === HARDCODED_ADMIN;
            setIsOwner(isContractOwner || isHardcodedAdmin);
        } else {
            setIsOwner(false);
        }
    }, [ownerAddress, address]);

    if (!isConnected) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Please connect your wallet.</div>;
    }

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Checking permissions...</div>;
    }

    if (!isOwner) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                <h2>Access Denied</h2>
                <p>You are not the owner of this contract.</p>
                <p>Current Owner: {ownerAddress}</p>
                <p>Your Address: {address}</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default AdminGuard;
