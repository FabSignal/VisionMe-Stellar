// apps/web/components/DepositForm.tsx
// apps/web/components/DepositForm.tsx
"use client";

import { useState } from 'react';
import { useDeposit } from '../hooks/useDeposit';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

const USDC_CONTRACT = "G..."; // Reemplaza con el contrato real
const XLM_CONTRACT = "XLM";

export const DepositForm: React.FC = () => {
  const [amount, setAmount] = useState('10');
  const [pocketId, setPocketId] = useState('123');
  const { depositWithSwap, isLoading, error } = useDeposit();
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const amountToStroops = (usd: string) => {
    try {
      const floatValue = parseFloat(usd);
      return Math.round(floatValue * 10_000_000).toString();
    } catch {
      return "0";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!user?.stellarPublicKey) {
      alert("Error: Public Key del usuario no encontrada.");
      return;
    }
    
    const amountInStroops = amountToStroops(amount);
    if (amountInStroops === "0" && amount !== "0") {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    const depositRequest = {
      pocketId,
      fromAsset: USDC_CONTRACT,
      toAsset: XLM_CONTRACT,
      amountIn: amountInStroops,
      fromAddress: user.stellarPublicKey,
    };

    try {
      const result = await depositWithSwap(depositRequest);
      setSuccessMessage(`Depósito completado! Tx ID: ${result.transactionHash.substring(0, 10)}...`);
      setAmount('');
    } catch (err) {
      console.error("Error en el depósito:", err);
    }
  };

  return (
    <div className="deposit-form-container">
      <h2 className="deposit-form-title">Depositar</h2>

      {successMessage && (
        <div className="deposit-alert deposit-alert-success">
          ✅ {successMessage}
        </div>
      )}
      
      {error && (
        <div className="deposit-alert deposit-alert-error">
          ❌ Error: {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="deposit-field">
          <label className="deposit-label" htmlFor="pocketId">
            ID del Pocket (Ahorro)
          </label>
          <input
            id="pocketId"
            type="text"
            value={pocketId}
            onChange={(e) => setPocketId(e.target.value)}
            required
            className="deposit-input"
            placeholder="Ej. 123"
          />
        </div>

        <div className="deposit-field">
          <label className="deposit-label" htmlFor="amount">
            Monto a Depositar (USD)
          </label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="deposit-input"
            placeholder="Ej. 10.50"
          />
          <span className="deposit-hint">
            El monto se convertirá y se enviará a Stellar.
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="deposit-button"
        >
          {isLoading ? (
            <LoadingSpinner size="small" message="Procesando..." />
          ) : (
            "Depositar y Ahorrar"
          )}
        </button>
      </form>
    </div>
  );
};