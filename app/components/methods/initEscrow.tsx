"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";

export default function InitEscrow() {
  const program = useProgram();
  const wallet = useAnchorWallet();

  const [escrowId, setEscrowId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const init_escrow = async () => {
    if (!program || !wallet) return;

    try {
      setLoading(true);

      const escrowIdBN = new BN(escrowId);
      const receiverPubkey = new PublicKey(receiver);
      const amountBN = new BN(amount);
      const deadlineBN = new BN(
        Math.floor(new Date(deadline).getTime() / 1000),
      );

      const tx = await program.methods
        .initializeEscrow(
          escrowIdBN,
          receiverPubkey,
          amountBN,
          deadlineBN,
          null, // mint: null for SOL escrow
        )
        .accounts({
          maker: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature:", tx);
      alert(`Escrow initialized! Tx: ${tx}`);
    } catch (e) {
      console.error(e);
      alert(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold"> Initialize Escrow </h2>

      <input
        className="border p-2 rounded"
        placeholder="Escrow ID (number)"
        value={escrowId}
        onChange={(e) => setEscrowId(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Receiver public key"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Amount (in lamports)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        type="datetime-local"
        placeholder="Deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        onClick={init_escrow}
        disabled={loading || !program || !wallet}
      >
        {loading ? "Initializing..." : "Initialize Escrow"}
      </button>
    </div>
  );
}
