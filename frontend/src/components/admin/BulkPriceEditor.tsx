import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, getContractAddress, TICKETPASS_ABI, SectionCode, SubSectionCode, mapSectionToCode } from '../../lib/contracts';
import { useChainId } from 'wagmi';

const SEPOLIA_ID = 11155111;

const BulkPriceEditor: React.FC = () => {
    const chainId = useChainId();
    const contractAddress = getContractAddress(chainId) || CONTRACT_ADDRESSES[SEPOLIA_ID];
    const { writeContract, data: txHash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    const [eventId, setEventId] = useState<number>(1);
    const [jsonInput, setJsonInput] = useState<string>(`[
  { "section": "CORO", "subSection": "DD", "priceMXN": 265 },
  { "section": "CORO", "subSection": "FF", "priceMXN": 265 },
  { "section": "CORO_LATERAL", "subSection": "DD", "priceMXN": 265 },
  { "section": "CORO_LATERAL", "subSection": "FF", "priceMXN": 265 },
  { "section": "LUNETA_ALTA", "subSection": "DD", "priceMXN": 309 },
  { "section": "LUNETA_ALTA", "subSection": "FF", "priceMXN": 309 },
  { "section": "LUNETA_BAJA", "subSection": "DD", "priceMXN": 398 },
  { "section": "LUNETA_BAJA", "subSection": "FF", "priceMXN": 398 },
  { "section": "PALCO", "subSection": "DD", "priceMXN": 398 },
  { "section": "PALCO", "subSection": "FF", "priceMXN": 398 },
  { "section": "PLATEA_ALTA", "subSection": "DD", "priceMXN": 309 },
  { "section": "PLATEA_ALTA", "subSection": "FF", "priceMXN": 309 },
  { "section": "PLATEA_BAJA", "subSection": "DD", "priceMXN": 398 },
  { "section": "PLATEA_BAJA", "subSection": "FF", "priceMXN": 398 }
]`);

    const handleBulkUpdate = async () => {
        try {
            const data = JSON.parse(jsonInput);
            if (!Array.isArray(data)) throw new Error("Input must be an array");

            // Loop through all items and trigger transactions
            // Note: This will trigger multiple wallet popups. 
            // Without a multicall contract, this is the only way to batch set prices.
            for (const item of data) {
                const sectionCode = mapSectionToCode(item.section);
                const sub = item.subSection === 'FF' ? SubSectionCode.FF : SubSectionCode.DD;
                const priceCents = BigInt(item.priceMXN * 100);

                writeContract({
                    address: contractAddress,
                    abi: TICKETPASS_ABI,
                    functionName: 'setSectionPriceMXN',
                    args: [eventId, sectionCode, sub, priceCents],
                });

                // Small delay to ensure order (optional but helpful)
                await new Promise(r => setTimeout(r, 500));
            }

        } catch (e: any) {
            alert("Error parsing JSON: " + e.message);
        }
    };

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3>Editor Masivo de Precios (JSON)</h3>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>ID del Evento:</label>
                <select
                    value={eventId}
                    onChange={(e) => setEventId(Number(e.target.value))}
                    style={{ padding: '0.5rem', borderRadius: '4px' }}
                >
                    <option value={1}>Evento 1 (Sábado 15)</option>
                    <option value={2}>Evento 2 (Domingo 16)</option>
                </select>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#666' }}>
                Pega un array JSON. Al hacer clic, se generarán <strong>múltiples transacciones</strong> (una por cada sección).
                Por favor confirma todas en tu billetera.
            </p>
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                style={{ width: '100%', height: '300px', fontFamily: 'monospace', padding: '0.5rem' }}
            />
            <button
                onClick={handleBulkUpdate}
                disabled={isPending || isConfirming}
                style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#6200ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {isPending ? 'Procesando...' : 'Actualizar TODOS los Precios'}
            </button>
            {isConfirmed && <div style={{ color: 'green', marginTop: '0.5rem' }}>¡Actualización Exitosa!</div>}
            {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>Error: {error.message}</div>}
        </div>
    );
};

export default BulkPriceEditor;
