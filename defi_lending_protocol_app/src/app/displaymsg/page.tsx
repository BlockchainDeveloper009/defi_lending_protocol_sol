"use client"; // Required for client-side interactivity

import { useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Solana RPC endpoint from your docker-compose setup
const SOLANA_RPC_URL = "http://solana:8899"; // Use "solana" for Docker network

const BalanceChecker: React.FC = () => {
  

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Solana Balance Checker</h1>
      <p>
        This tool allows you to check the SOL balance of a Solana wallet
        address.
      </p>
    </div>
  );
};

export default BalanceChecker;