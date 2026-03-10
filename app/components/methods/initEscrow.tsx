"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";
import { TxStatus } from "../utils";
import { Btn, Field, Panel, SHead, TxBox } from "../style/functions";
import { C, SOL } from "../style/variables";

export function InitEscrow({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet = useAnchorWallet();
  const [f, setF] = useState({
    id: "",
    receiver: "",
    amount: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TxStatus>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const run = async () => {
    if (!program || !wallet)
      return setStatus({
        sig: "",
        ok: false,
        msg: "Connect your wallet first.",
      });
    try {
      setLoading(true);
      setStatus(null);
      const tx = await program.methods
        .initializeEscrow(
          new BN(f.id),
          new PublicKey(f.receiver),
          new BN(f.amount),
          new BN(Math.floor(new Date(f.deadline).getTime() / 1000)),
          null,
        )
        .accounts({
          maker: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setStatus({ sig: tx, ok: true, msg: "" });
      onDone?.();
    } catch (e: any) {
      setStatus({ sig: "", ok: false, msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel accent="gradient" id="init">
      <SHead
        n="instruction · 01"
        title="Initialize Escrow"
        accent={SOL.green}
      />
      <p
        style={{
          color: C.mutedFg,
          fontSize: 13,
          lineHeight: 1.75,
          marginBottom: 24,
        }}
      >
        Create a new on-chain escrow account. Define the receiver public key,
        SOL amount in lamports, and a future unlock deadline.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "0 16px",
        }}
      >
        <Field
          label="Escrow ID"
          placeholder="e.g. 1001"
          value={f.id}
          onChange={set("id")}
        />
        <Field
          label="Amount (lamports)"
          placeholder="e.g. 1000000000"
          value={f.amount}
          onChange={set("amount")}
        />
      </div>
      <Field
        label="Receiver Public Key"
        placeholder="Base58 address…"
        value={f.receiver}
        onChange={set("receiver")}
      />
      <Field
        label="Deadline"
        type="datetime-local"
        value={f.deadline}
        onChange={set("deadline")}
      />
      <Btn variant="green" size="lg" full loading={loading} onClick={run}>
        Initialize Escrow
      </Btn>
      <TxBox status={status} />
    </Panel>
  );
}
