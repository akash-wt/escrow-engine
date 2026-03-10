"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";
import { TxStatus } from "../utils";
import { Btn, Note, Panel, SHead, TxBox } from "../style/functions";

export function CancelInstruction({ onDone }: { onDone?: () => void }) {
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
        .cancel()
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
    <Panel accent="red" id="cancel">
      <SHead n="instruction · 04" title="Cancel" accent="#ef4444" />
      <Note color="#ef4444" icon="⚠">
        Permanently cancels the escrow and returns deposited funds to the maker.
        This action cannot be undone.
      </Note>
      <Btn variant="red" size="lg" full loading={loading} onClick={run}>
        Cancel Escrow
      </Btn>
      <TxBox status={status} />
    </Panel>
  );
}
