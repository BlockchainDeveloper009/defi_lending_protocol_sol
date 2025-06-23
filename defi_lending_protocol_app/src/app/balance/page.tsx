"use client"; // Required for client-side interactivity

import { useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Solana RPC endpoint from your docker-compose setup
const SOLANA_RPC_URL = "https://api.devnet.solana.com"; // Use "solana" for Docker network
//const SOLANA_RPC_URL = "http://solana:8899"; // Use "solana" for Docker network

const BalanceChecker: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      // Initialize Solana connection
      const connection = new Connection(SOLANA_RPC_URL, "confirmed");

      // Validate public key
      let accountPublicKey: PublicKey;
      try {
        accountPublicKey = new PublicKey(publicKey);
      } catch (err) {
        throw new Error("Invalid public key format");
      }

      // Fetch account balance in lamports
      const balanceInLamports = await connection.getBalance(accountPublicKey);

      // Convert lamports to SOL
      const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
      setBalance(balanceInSol);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publicKey.trim()) {
      fetchBalance();
    } else {
      setError("Please enter a public key");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Solana Balance Checker</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="publicKey">Enter Solana Public Key:</label>
          <input
            id="publicKey"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="e.g., 5oV8JqJ4e5eR9b3QvWqYhZ4v3x8f4z3n4k5p6q7r8t9"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking..." : "Check Balance"}
        </button>
      </form>
      {balance !== null && (
        <p style={{ marginTop: "20px" }}>
          Balance: <strong>{balance} SOL</strong>
        </p>
      )}
      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>Error: {error}</p>
      )}
    </div>
  );
};

export default BalanceChecker;
//sambhar aarthi
//rice, rasaam, apalam, poriyal, kootu, 
// curd, mango pickle, buttermilk
//chappati, aloo gobi, chana masala,
//sweet
