"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";
import { TxStatus } from "../utils";
import { Btn, Note, Panel, SHead, TxBox } from "../style/functions";
import { SOL } from "../style/variables";

export function Claim({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TxStatus>(null);

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
        .claim()
        .accounts({
          receiver: wallet.publicKey,
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
    <Panel accent="purple" id="claim">
      <SHead n="instruction · 03" title="Claim" accent={SOL.purple} />
      <Note color={SOL.purple} icon="ℹ">
        Only the receiver specified at initialization can claim. The escrow
        deadline must have already passed.
      </Note>
      <Btn variant="purple" size="lg" full loading={loading} onClick={run}>
        Claim Funds
      </Btn>
      <TxBox status={status} />
    </Panel>
  );
}
