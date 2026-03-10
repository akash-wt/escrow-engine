"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";
import { TxStatus } from "../utils";
import { Btn, Field, Panel, SHead, TxBox } from "../style/functions";
import { C, SOL } from "../style/variables";

export function Deposit({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet  = useAnchorWallet();
  const [escrowId, setEscrowId] = useState("");
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<TxStatus>(null);

  const run = async () => {
    if (!program || !wallet) return setStatus({ sig: "", ok: false, msg: "Connect your wallet first." });
    try {
      setLoading(true); setStatus(null);
      const tx = await program.methods.deposite()
        .accounts({ maker: wallet.publicKey, systemProgram: SystemProgram.programId }).rpc();
      setStatus({ sig: tx, ok: true, msg: "" }); onDone?.();
    } catch (e: any) { setStatus({ sig: "", ok: false, msg: e.message }); }
    finally { setLoading(false); }
  };

  return (
    <Panel accent="cyan" id="deposit">
      <SHead n="instruction · 02" title="Deposit" accent={SOL.cyan} />
      <p style={{ color: C.mutedFg, fontSize: 13, lineHeight: 1.75, marginBottom: 24 }}>
        Fund an initialized escrow with the agreed SOL amount. The maker must sign this transaction.
      </p>
      <Field label="Escrow ID" placeholder="e.g. 1001" value={escrowId} onChange={e => setEscrowId(e.target.value)} />
      <Btn variant="cyan" size="lg" full loading={loading} onClick={run}>Deposit Funds</Btn>
      <TxBox status={status} />
    </Panel>
  );
}
