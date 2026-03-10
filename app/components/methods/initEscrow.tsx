"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { useProgram } from "../hooks/useProgram";

export default function InitEscrow({ onDone }: { onDone?: () => void }) {
  const program = useProgram();
  const wallet = useAnchorWallet();

  const [f, setF] = useState({
    id: "",
    receiver: "",
    amount: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    ok: boolean;
    msg: string;
    sig: string;
  } | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const run = async () => {
    if (!program || !wallet) {
      setStatus({ ok: false, sig: "", msg: "Connect your wallet first." });
      return;
    }
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
    <div
      id="init"
      className="rounded-2xl border border-white/10 bg-linear-to-br from-[#0f1a14] to-[#0a1a10] p-6 flex flex-col gap-5 shadow-xl shadow-black/40"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono tracking-widest text-[#4ade80]/60 uppercase">
          instruction · 01
        </span>
        <h2 className="text-xl font-semibold text-[#4ade80] tracking-tight">
          Initialize Escrow
        </h2>
      </div>

      <p className="text-sm text-white/40 leading-relaxed -mt-2">
        Create a new on-chain escrow account. Define the receiver public key,
        SOL amount in lamports, and a future unlock deadline.
      </p>

      {/* Grid row: ID + Amount */}
      <div className="grid grid-cols-2 gap-3">
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
        placeholder="Base58 address..."
        value={f.receiver}
        onChange={set("receiver")}
      />
      <Field
        label="Deadline"
        type="datetime-local"
        value={f.deadline}
        onChange={set("deadline")}
      />

      <button
        onClick={run}
        disabled={loading || !program || !wallet}
        className="w-full py-3 rounded-xl bg-[#4ade80] text-black font-semibold text-sm tracking-wide
          hover:bg-[#22c55e] active:scale-[0.98] transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#4ade80]
          flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        )}
        {loading ? "Initializing..." : "Initialize Escrow"}
      </button>

      {/* Status box */}
      {status && (
        <div
          className={`rounded-xl p-4 text-sm font-mono border ${
            status.ok
              ? "bg-[#4ade80]/10 border-[#4ade80]/20 text-[#4ade80]"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.ok ? (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">✓ Escrow initialized</span>
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

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white
          placeholder:text-white/20 focus:outline-none focus:border-[#4ade80]/50 focus:bg-white/8
          transition-colors duration-150 [color-scheme:dark]"
      />
    </div>
  );
}
