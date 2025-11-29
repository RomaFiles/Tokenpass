import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { CONTRACT_ADDRESS, TICKETPASS_ABI, SectionCode, SubSectionCode } from '../../lib/contracts';
import { EVENT_PRICES } from '../../data/eventPrices';

const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";
const MULTICALL3_ABI = [
    {
        inputs: [
            {
                components: [
                    { name: "target", type: "address" },
                    { name: "allowFailure", type: "bool" },
                    { name: "callData", type: "bytes" }
                ],
                name: "calls",
                type: "tuple[]"
            }
        ],
        name: "aggregate3",
        outputs: [
            {
                components: [
                    { name: "success", type: "bool" },
                    { name: "returnData", type: "bytes" }
                ],
                name: "returnData",
                type: "tuple[]"
            }
        ],
        stateMutability: "payable",
        type: "function"
    }
] as const;

const PriceInitializer = () => {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
    const [logs, setLogs] = useState<string[]>([]);
    const [initializingEventId, setInitializingEventId] = useState<number | null>(null);

    const initializeEvent = async (eventId: number) => {
        setInitializingEventId(eventId);
        setLogs(prev => [...prev, `Preparing batch for Event ID ${eventId}...`]);

        const eventConfig = EVENT_PRICES.find(e => e.eventId === eventId);
        if (!eventConfig) {
            setLogs(prev => [...prev, `❌ Error: Configuration not found for Event ${eventId}`]);
            setInitializingEventId(null);
            return;
        }

        try {
            const tasks: any[] = [];
            Object.entries(eventConfig.prices).forEach(([sectionKey, price]) => {
                const section = SectionCode[sectionKey as keyof typeof SectionCode];
                if (section === undefined || price === undefined) return;

                // Set for both subsections
                tasks.push({ eventId: eventId, section, subSection: SubSectionCode.FF, price: price * 100 }); // Cents
                tasks.push({ eventId: eventId, section, subSection: SubSectionCode.DD, price: price * 100 }); // Cents
            });

            const calls = tasks.map(task => {
                const callData = encodeFunctionData({
                    abi: TICKETPASS_ABI,
                    functionName: 'setSectionPriceMXN',
                    args: [task.eventId, task.section, task.subSection, BigInt(task.price)]
                });

                return {
                    target: CONTRACT_ADDRESS,
                    allowFailure: false,
                    callData
                };
            });

            writeContract({
                address: MULTICALL3_ADDRESS,
                abi: MULTICALL3_ABI,
                functionName: 'aggregate3',
                args: [calls],
            });

        } catch (e: any) {
            setLogs(prev => [...prev, `❌ Error preparing transaction: ${e.message}`]);
            setInitializingEventId(null);
        }
    };

    return (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Price Initializer (Per Event)</h2>
            <p>Initialize prices for each event individually to optimize gas usage.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                {EVENT_PRICES.map((event) => (
                    <div key={event.eventId} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', background: '#f9f9f9' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>Event {event.eventId}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{Object.keys(event.prices).length} Sections</p>
                        <button
                            onClick={() => initializeEvent(event.eventId)}
                            disabled={isPending || isConfirming}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: initializingEventId === event.eventId ? '#4caf50' : '#0d76fc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {initializingEventId === event.eventId && (isPending || isConfirming) ? 'Processing...' : 'Initialize'}
                        </button>
                    </div>
                ))}
            </div>

            {hash && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e9', borderRadius: '4px', wordBreak: 'break-all' }}>
                    <p><strong>Transaction Hash:</strong> {hash}</p>
                    {isConfirming && <p>Waiting for confirmation...</p>}
                    {isConfirmed && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Transaction Confirmed!</p>}
                </div>
            )}

            {error && (
                <div style={{ marginTop: '1rem', color: 'red' }}>
                    <p>Error: {error.message}</p>
                </div>
            )}

            <div style={{ marginTop: '2rem', maxHeight: '200px', overflowY: 'auto', background: '#333', color: '#0f0', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {logs.length === 0 ? <div>Ready to initialize...</div> : logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default PriceInitializer;
