"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";
import { TxStatus } from "../utils";
import { Btn, Field, Panel, SHead, TxBox } from "../style/functions";
import { C, SOL } from "../style/variables";

export function CreateEscrow({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet = useAnchorWallet();
  const escrowId = new BN(Date.now() + Math.floor(Math.random() * 1000));

  const [f, setF] = useState({
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

      const selected = new Date(f.deadline).getTime();
      if (selected <= Date.now()) {
        throw Error("Time must be set in future!");
      }

      const amountInLamports = Number(f.amount) * LAMPORTS_PER_SOL;
      console.log(f);
      console.log("amount in lamports", amountInLamports);

      const tx = await program.methods
        .createEscrow(
          new BN(escrowId),
          new PublicKey(f.receiver),
          new BN(amountInLamports),
          new BN(Math.floor(new Date(f.deadline).getTime() / 1000)),
          null,
        )
        .accounts({
          maker: wallet.publicKey,
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
    <Panel accent="gradient" id="create">
      <SHead n="instruction · 01" title="Create Escrow" accent={SOL.green} />
      <p
        style={{
          color: C.mutedFg,
          fontSize: 13,
          lineHeight: 1.75,
          marginBottom: 24,
        }}
      >
        Create a new on-chain escrow account. Define the receiver public key,
        SOL amount , and a future unlock deadline.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "0 16px",
        }}
      >
        <Field
          label="Amount (sol)"
          placeholder="e.g. 0.5"
          value={f.amount}
          onChange={set("amount")}
        />
      </div>
      <Field
        label="Receiver Public Key"
        placeholder="address…"
        value={f.receiver}
        onChange={set("receiver")}
      />
      <Field
        label="Deadline"
        type="datetime-local"
        value={f.deadline}
        min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 19)}
        step={1}
        onChange={set("deadline")}
      />
      <Btn variant="green" size="lg" full loading={loading} onClick={run}>
        Create Escrow
      </Btn>
      <TxBox status={status} />
    </Panel>
  );
}
