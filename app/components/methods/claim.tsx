"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";

export default function Claim({ onDone }: { onDone?: () => void }) {
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
    <div
      id="claim"
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#130d1f] to-[#0d0814] p-6 flex flex-col gap-5 shadow-xl shadow-black/40"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono tracking-widest text-purple-400/60 uppercase">
          instruction · 03
        </span>
        <h2 className="text-xl font-semibold text-purple-400 tracking-tight">
          Claim
        </h2>
      </div>

      {/* Info note */}
      <div className="flex gap-3 rounded-xl bg-purple-400/10 border border-purple-400/20 px-4 py-3">
        <span className="text-purple-400 mt-0.5 text-sm">ℹ</span>
        <p className="text-sm text-purple-300/70 leading-relaxed">
          Only the receiver specified at initialization can claim. The escrow
          deadline must have already passed.
        </p>
      </div>

      <button
        onClick={run}
        disabled={loading || !program || !wallet}
        className="w-full py-3 rounded-xl bg-purple-500 text-white font-semibold text-sm tracking-wide
          hover:bg-purple-400 active:scale-[0.98] transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-500
          flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {loading ? "Claiming..." : "Claim Funds"}
      </button>

      {status && (
        <div
          className={`rounded-xl p-4 text-sm font-mono border ${
            status.ok
              ? "bg-purple-400/10 border-purple-400/20 text-purple-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.ok ? (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">✓ Funds claimed</span>
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
