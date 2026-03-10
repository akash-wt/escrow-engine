"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";

export default function Deposit({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet = useAnchorWallet();
  const [escrowId, setEscrowId] = useState("");
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
        .deposite()
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
      id="deposit"
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1520] to-[#071018] p-6 flex flex-col gap-5 shadow-xl shadow-black/40"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono tracking-widest text-cyan-400/60 uppercase">
          instruction · 02
        </span>
        <h2 className="text-xl font-semibold text-cyan-400 tracking-tight">
          Deposit
        </h2>
      </div>

      <p className="text-sm text-white/40 leading-relaxed -mt-2">
        Fund an initialized escrow with the agreed SOL amount. The maker must
        sign this transaction.
      </p>

      {/* Escrow ID field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
          Escrow ID
        </label>
        <input
          type="text"
          placeholder="e.g. 1001"
          value={escrowId}
          onChange={(e) => setEscrowId(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white
            placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 focus:bg-white/8
            transition-colors duration-150"
        />
      </div>

      <button
        onClick={run}
        disabled={loading || !program || !wallet}
        className="w-full py-3 rounded-xl bg-cyan-400 text-black font-semibold text-sm tracking-wide
          hover:bg-cyan-300 active:scale-[0.98] transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cyan-400
          flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        )}
        {loading ? "Depositing..." : "Deposit Funds"}
      </button>

      {status && (
        <div
          className={`rounded-xl p-4 text-sm font-mono border ${
            status.ok
              ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.ok ? (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">✓ Funds deposited</span>
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
