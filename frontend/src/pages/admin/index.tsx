import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import AdminGuard from '../../components/admin/AdminGuard';
import BulkPriceEditor from '../../components/admin/BulkPriceEditor';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI } from '../../lib/contracts';
import { useChainId } from 'wagmi';

const SEPOLIA_ID = 11155111;

const AdminDashboard = () => {
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];
    const { address } = useAccount();

    const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'finance'>('general');

    // --- Contract Reads ---
    const { data: paused, refetch: refetchPaused } = useReadContract({
        address: contractAddress,
        abi: TICKETPASS_ABI,
        functionName: 'paused',
    });

    const { data: contractBalance, refetch: refetchBalance } = useBalance({
        address: contractAddress,
    });

    // --- Contract Writes ---
    const { writeContract: pauseContract, isPending: isPausing } = useWriteContract();
    const { writeContract: unpauseContract, isPending: isUnpausing } = useWriteContract();
    const { writeContract: withdrawFunds, isPending: isWithdrawing } = useWriteContract();
    const { writeContract: setRates, isPending: isSettingRates } = useWriteContract();

    // --- Handlers ---
    const handlePauseToggle = () => {
        if (paused) {
            unpauseContract({
                address: contractAddress,
                abi: TICKETPASS_ABI,
                functionName: 'unpause',
            }, { onSuccess: () => setTimeout(refetchPaused, 2000) });
        } else {
            pauseContract({
                address: contractAddress,
                abi: TICKETPASS_ABI,
                functionName: 'pause',
            }, { onSuccess: () => setTimeout(refetchPaused, 2000) });
        }
    };

    const handleWithdraw = () => {
        if (!address) return;
        withdrawFunds({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'withdraw',
            args: [address], // Withdraw to self (owner)
        }, { onSuccess: () => setTimeout(refetchBalance, 2000) });
    };

    const handleSetRates = () => {
        const SEPOLIA_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
        const RATE = BigInt(50000); // 1 MXN = 0.05 USD
        setRates({
            address: contractAddress,
            abi: TICKETPASS_ABI,
            functionName: 'setRates',
            args: [SEPOLIA_FEED, RATE],
        });
    };

    return (
        <AdminGuard>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1rem' }}>Admin Dashboard</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
                    <button
                        onClick={() => setActiveTab('general')}
                        style={{ padding: '0.5rem 1rem', background: activeTab === 'general' ? '#eee' : 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'general' ? 'bold' : 'normal' }}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        style={{ padding: '0.5rem 1rem', background: activeTab === 'pricing' ? '#eee' : 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'pricing' ? 'bold' : 'normal' }}
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab('finance')}
                        style={{ padding: '0.5rem 1rem', background: activeTab === 'finance' ? '#eee' : 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'finance' ? 'bold' : 'normal' }}
                    >
                        Finance
                    </button>
                </div>

                {activeTab === 'general' && (
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3>Contract Status</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    background: paused ? '#ffebee' : '#e8f5e9',
                                    color: paused ? '#c62828' : '#2e7d32',
                                    fontWeight: 'bold'
                                }}>
                                    {paused ? 'PAUSED' : 'ACTIVE'}
                                </div>
                                <button
                                    onClick={handlePauseToggle}
                                    disabled={isPausing || isUnpausing}
                                    style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                                >
                                    {paused ? 'Unpause Contract' : 'Pause Contract'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3>Exchange Rates</h3>
                            <p>Current Config: Sepolia Feed / 1 MXN = 0.05 USD</p>
                            <button
                                onClick={handleSetRates}
                                disabled={isSettingRates}
                                style={{ padding: '0.5rem 1rem', cursor: 'pointer', marginTop: '0.5rem' }}
                            >
                                Reset/Update Rates
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div>
                        <h3>Bulk Price Update</h3>
                        <BulkPriceEditor />
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div>
                        <h3>Contract Balance</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
                            {contractBalance ? `${formatEther(contractBalance.value)} ${contractBalance.symbol}` : '...'}
                        </div>
                        <button
                            onClick={handleWithdraw}
                            disabled={isWithdrawing || !contractBalance || contractBalance.value === 0n}
                            style={{
                                padding: '1rem 2rem',
                                background: '#6200ea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1.1rem'
                            }}
                        >
                            {isWithdrawing ? 'Withdrawing...' : 'Withdraw All Funds'}
                        </button>
                    </div>
                )}
            </div>
        </AdminGuard>
    );
};

export default AdminDashboard;
