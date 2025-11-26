import React, { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useChainId, useSwitchChain } from 'wagmi';

import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI } from '../../lib/contracts';
import TicketCard from '../../components/tickets/TicketCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import styles from '../../styles/Home.module.css'; // Re-using home styles for consistency

const SEPOLIA_ID = 11155111;

interface TicketData {
    tokenId: bigint;
    seatId: bigint;
}

const MyTicketsPage = () => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const publicClient = usePublicClient();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];

    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");
    const [scanRange, setScanRange] = useState(500000n); // Default scan range

    const fetchTickets = async () => {
        if (!address || !publicClient) return;
        if (chainId !== SEPOLIA_ID) return;

        setLoading(true);
        setTickets([]);
        setProgress("Consultando API...");

        try {
            // Use Etherscan API to find all token transfers for this user
            // This is much faster than scanning blocks via RPC
            const response = await fetch(
                `https://api.etherscan.io/v2/api?chainid=11155111&module=account&action=tokennfttx&contractaddress=${contractAddress}&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=VM6KK95PGNC9KCVI2QH71G451593H927U1`
            );

            const data = await response.json();

            if (data.status !== "1" && data.message !== "No transactions found") {
                throw new Error(data.result || "Error de API Explorer");
            }

            const transfers = data.result || [];

            // Calculate current ownership locally
            // We need to track which tokens entered and left the wallet
            const ownedTokenIds = new Set<string>();

            for (const tx of transfers) {
                if (tx.to.toLowerCase() === address.toLowerCase()) {
                    ownedTokenIds.add(tx.tokenID);
                }
                if (tx.from.toLowerCase() === address.toLowerCase()) {
                    ownedTokenIds.delete(tx.tokenID);
                }
            }

            setProgress(`Encontrados ${ownedTokenIds.size} tickets potenciales. Verificando...`);

            const verifiedTickets: TicketData[] = [];

            // Verify current ownership on-chain (source of truth)
            for (const idStr of Array.from(ownedTokenIds)) {
                try {
                    const tokenId = BigInt(idStr);
                    const owner = await publicClient.readContract({
                        address: contractAddress,
                        abi: TICKETPASS_ABI,
                        functionName: 'ownerOf',
                        args: [tokenId],
                    });

                    if (owner.toLowerCase() === address.toLowerCase()) {
                        verifiedTickets.push({ tokenId, seatId: tokenId });
                    }
                } catch (e) {
                    console.warn(`Token ${idStr} verification failed`, e);
                }
            }

            setTickets(verifiedTickets);

        } catch (e) {
            console.error("Error fetching tickets:", e);
            setProgress("Error cargando tickets. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
            setProgress("");
        }
    };

    useEffect(() => {
        if (isConnected && chainId === SEPOLIA_ID) {
            fetchTickets();
        } else {
            setTickets([]);
        }
    }, [address, isConnected, chainId]);

    return (
        <div style={{ padding: '2rem', paddingTop: '100px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: '#0d76fc', fontWeight: 'bold' }}>
                    &larr; Volver a Recintos
                </Link>
                <h1 style={{ margin: 0 }}>Mis Tickets</h1>
            </div>

            {!isConnected ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <p>Conecta tu billetera para ver tus tickets.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <ConnectButton />
                    </div>
                </div>
            ) : chainId !== SEPOLIA_ID ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#fff3e0', borderRadius: '8px', color: '#e65100' }}>
                    <h3>Red Incorrecta</h3>
                    <p>Por favor cambia a Sepolia para ver tus tickets.</p>
                    <button
                        onClick={() => switchChain({ chainId: SEPOLIA_ID })}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#e65100', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cambiar a Sepolia
                    </button>
                </div>
            ) : (
                <div>
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>Cargando tickets...</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{progress}</div>
                        </div>
                    )}

                    {!loading && tickets.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                            <p>No se encontraron tickets.</p>
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {tickets.map(t => (
                            <TicketCard
                                key={t.tokenId.toString()}
                                tokenId={t.tokenId}
                                seatId={t.seatId}
                                owner={address!}
                                onTransferSuccess={fetchTickets}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTicketsPage;
