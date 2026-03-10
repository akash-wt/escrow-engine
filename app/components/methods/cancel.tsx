"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";

export default function CancelInstruction({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    ok: boolean;
    msg: string;
    sig: string;
  } | null>(null);

  const run = async () => {
    if (!program || !wallet) {
      setStatus({ ok: false, sig: "", msg: "Connect your wallet first." });
      return;
    }
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
    <div
      id="cancel"
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1f0d0d] to-[#140808] p-6 flex flex-col gap-5 shadow-xl shadow-black/40"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono tracking-widest text-red-400/60 uppercase">
          instruction · 04
        </span>
        <h2 className="text-xl font-semibold text-red-400 tracking-tight">
          Cancel
        </h2>
      </div>

      {/* Warning note */}
      <div className="flex gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
        <span className="text-red-400 mt-0.5 text-sm">⚠</span>
        <p className="text-sm text-red-300/70 leading-relaxed">
          Permanently cancels the escrow and returns deposited funds to the
          maker. This action cannot be undone.
        </p>
      </div>

      <button
        onClick={run}
        disabled={loading || !program || !wallet}
        className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold text-sm tracking-wide
          hover:bg-red-400 active:scale-[0.98] transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-500
          flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {loading ? "Cancelling..." : "Cancel Escrow"}
      </button>

      {status && (
        <div
          className={`rounded-xl p-4 text-sm font-mono border ${
            status.ok
              ? "bg-red-400/10 border-red-400/20 text-red-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.ok ? (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">✓ Escrow cancelled</span>
              <span className="text-[11px] text-white/40 break-all">
                {status.sig}
              </span>
            </div>
          ) : (
            <span>✗ {status.msg}</span>
          )}
        </div>
      )}
    </div>
  );
}
