import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, TICKETPASS_ABI } from '../../lib/contracts';
import Navigation from '../../components/Navigation';
import BulkPriceEditor from '../../components/admin/BulkPriceEditor';
import PriceInitializer from '../../components/admin/PriceInitializer';

const AdminDashboard = () => {
    const { address } = useAccount();
    const [activeTab, setActiveTab] = useState<'prices' | 'withdraw' | 'pause' | 'init'>('prices');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Contract Owner Check
    const { data: owner } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: TICKETPASS_ABI,
        functionName: 'owner',
    });

    // Balance Check
    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: [{
            inputs: [{ name: "owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
        }] as const, // Using balanceOf for ERC20/ERC721 or native balance? 
        // Wait, the contract has a 'withdraw' function, implying it holds ETH.
        // We should check the ETH balance of the contract address directly.
        // But wagmi's useBalance hook is better for that.
        // Let's stick to simple owner check for now.
    });

    // Pause/Unpause
    const { data: paused, refetch: refetchPaused } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: TICKETPASS_ABI,
        functionName: 'paused',
    });

    const { writeContract: writePause, data: pauseHash } = useWriteContract();
    const { isLoading: isPausing } = useWaitForTransactionReceipt({ hash: pauseHash });

    const togglePause = () => {
        if (paused) {
            writePause({
                address: CONTRACT_ADDRESS,
                abi: TICKETPASS_ABI,
                functionName: 'unpause',
            });
        } else {
            writePause({
                address: CONTRACT_ADDRESS,
                abi: TICKETPASS_ABI,
                functionName: 'pause',
            });
        }
    };

    // Withdraw
    const { writeContract: writeWithdraw, data: withdrawHash } = useWriteContract();
    const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({ hash: withdrawHash });

    const handleWithdraw = () => {
        if (!address) return;
        writeWithdraw({
            address: CONTRACT_ADDRESS,
            abi: TICKETPASS_ABI,
            functionName: 'withdraw',
            args: [address],
        });
    };

    if (!mounted) return null;

    if (owner && address && owner !== address) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You are not the owner of this contract.</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Head>
                <title>Admin Dashboard | TicketPass</title>
            </Head>
            <Navigation />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('prices')}
                        style={{
                            padding: '1rem 2rem',
                            background: activeTab === 'prices' ? '#0d76fc' : 'white',
                            color: activeTab === 'prices' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Price Management
                    </button>
                    <button
                        onClick={() => setActiveTab('init')}
                        style={{
                            padding: '1rem 2rem',
                            background: activeTab === 'init' ? '#0d76fc' : 'white',
                            color: activeTab === 'init' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Inicialización
                    </button>
                    <button
                        onClick={() => setActiveTab('withdraw')}
                        style={{
                            padding: '1rem 2rem',
                            background: activeTab === 'withdraw' ? '#0d76fc' : 'white',
                            color: activeTab === 'withdraw' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Finance
                    </button>
                    <button
                        onClick={() => setActiveTab('pause')}
                        style={{
                            padding: '1rem 2rem',
                            background: activeTab === 'pause' ? '#0d76fc' : 'white',
                            color: activeTab === 'pause' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Control
                    </button>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    {activeTab === 'prices' && <BulkPriceEditor />}

                    {activeTab === 'init' && <PriceInitializer />}

                    {activeTab === 'withdraw' && (
                        <div>
                            <h2>Finance</h2>
                            <p>Withdraw all funds from the contract to your wallet.</p>
                            <button
                                onClick={handleWithdraw}
                                disabled={isWithdrawing}
                                style={{
                                    marginTop: '1rem',
                                    padding: '1rem 2rem',
                                    background: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isWithdrawing ? 'not-allowed' : 'pointer',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
                            </button>
                            {withdrawHash && <p style={{ marginTop: '1rem', color: 'green' }}>Withdrawal transaction sent!</p>}
                        </div>
                    )}

                    {activeTab === 'pause' && (
                        <div>
                            <h2>Contract Control</h2>
                            <p>Current Status: <strong>{paused ? 'PAUSED' : 'ACTIVE'}</strong></p>
                            <button
                                onClick={togglePause}
                                disabled={isPausing}
                                style={{
                                    marginTop: '1rem',
                                    padding: '1rem 2rem',
                                    background: paused ? '#4caf50' : '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isPausing ? 'not-allowed' : 'pointer',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {isPausing ? 'Processing...' : paused ? 'Unpause Contract' : 'Pause Contract'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
