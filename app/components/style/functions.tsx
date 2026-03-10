"use client";

import { useState } from "react";
import { C, SOL, STATUS } from "./variables";
import { addrUrl, short, TxStatus, txUrl } from "../utils";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../hooks/useProgram";
import { SystemProgram } from "@solana/web3.js";

type BtnVariant = "purple" | "cyan" | "green" | "red" | "ghost";
export function Btn({
  children,
  variant = "ghost",
  size = "md",
  loading,
  full,
  onClick,
  disabled,
  style,
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  full?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  const V: Record<
    BtnVariant,
    { bc: string; c: string; hbg: string; hbc: string }
  > = {
    purple: {
      bc: SOL.purpleBorder,
      c: SOL.purple,
      hbg: SOL.purpleDim,
      hbc: SOL.purple,
    },
    cyan: { bc: SOL.cyanBorder, c: SOL.cyan, hbg: SOL.cyanDim, hbc: SOL.cyan },
    green: {
      bc: SOL.greenBorder,
      c: SOL.green,
      hbg: SOL.greenDim,
      hbc: SOL.green,
    },
    red: {
      bc: "rgba(239,68,68,.35)",
      c: "#ef4444",
      hbg: "rgba(239,68,68,.1)",
      hbc: "#ef4444",
    },
    ghost: { bc: C.border2, c: C.dimFg, hbg: "#111", hbc: "#333" },
  };
  const S = {
    sm: { p: "6px 14px", fs: 12 },
    md: { p: "10px 20px", fs: 13 },
    lg: { p: "12px 26px", fs: 13 },
  }[size];
  const v = V[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: full ? "100%" : "auto",
        background: hov ? v.hbg : "transparent",
        border: `1px solid ${hov ? v.hbc : v.bc}`,
        color: v.c,
        padding: S.p,
        fontSize: S.fs,
        fontFamily: "'IBM Plex Mono',monospace",
        letterSpacing: ".06em",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled && !loading ? 0.35 : 1,
        transition: "all .15s",
        ...style,
      }}
    >
      {loading && (
        <span
          style={{
            width: 11,
            height: 11,
            border: "1.5px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            flexShrink: 0,
          }}
          className="sp"
        />
      )}
      {children}
    </button>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        padding: "48px 24px",
        textAlign: "center",
        color: C.mutedFg,
        fontSize: 13,
        letterSpacing: ".06em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}

export function Note({
  color,
  icon,
  children,
}: {
  color: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: color + "0a",
        border: `1px solid ${color}28`,
        padding: "10px 14px",
        marginBottom: 20,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <span style={{ color, fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <p style={{ color: C.dimFg, fontSize: 12, lineHeight: 1.65 }}>
        {children}
      </p>
    </div>
  );
}

export function Chip({ status }: { status: string }) {
  const s = STATUS[status] ?? {
    color: C.dimFg,
    bg: "transparent",
    border: C.border,
    label: status,
  };
  return (
    <span
      style={{
        fontSize: 10,
        letterSpacing: ".12em",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: "2px 8px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

export function TxBox({ status }: { status: TxStatus }) {
  if (!status) return null;
  return (
    <div
      className="fu"
      style={{
        marginTop: 14,
        padding: "10px 14px",
        border: `1px solid ${
          status.ok ? SOL.greenBorder : "rgba(239,68,68,.35)"
        }`,
        background: status.ok ? SOL.greenDim : "rgba(239,68,68,.05)",
        color: status.ok ? SOL.green : "#ef4444",
        fontSize: 12,
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontWeight: 600 }}>
        {status.ok ? "✓ Transaction confirmed" : "✗ " + status.msg}
      </div>
      {status.ok && (
        <a
          href={txUrl(status.sig)}
          target="_blank"
          rel="noreferrer"
          style={{
            color: SOL.green,
            fontSize: 11,
            opacity: 0.7,
            wordBreak: "break-all",
          }}
        >
          {short(status.sig)} → view on explorer ↗
        </a>
      )}
    </div>
  );
}

export function GradDivider() {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(90deg,transparent,rgba(153,69,255,.4),rgba(0,194,255,.4),rgba(20,241,149,.4),transparent)",
        margin: "48px 0",
      }}
    />
  );
}

export function SHead({
  n,
  title,
  accent,
}: {
  n: string;
  title: string;
  accent: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: ".18em",
          color: accent,
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {n}
      </div>
      <h2
        className="vt"
        style={{
          fontSize: "clamp(30px,4vw,44px)",
          color: C.white,
          letterSpacing: ".02em",
          lineHeight: 1,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: ".16em",
        color: C.mutedFg,
        textTransform: "uppercase",
        marginBottom: 6,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export function EscrowCard({
  escrow,
  onAction,
}: {
  escrow: any;
  onAction: () => void;
}) {
  const { publicKey } = useWallet();
  const program = useProgram();
  const wallet = useAnchorWallet();
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSt, setCancelSt] = useState<TxStatus>(null);

  const statusKey = Object.keys(escrow.account.status)[0];
  const isMaker = publicKey?.toBase58() === escrow.account.maker.toBase58();
  const isActive = statusKey === "created" || statusKey === "funded";
  const deadline = new Date(escrow.account.deadline.toNumber() * 1000);
  const sol = (escrow.account.amount.toNumber() / 1e9).toFixed(4);
  const isPast = Date.now() > deadline.getTime();

  const doCancel = async () => {
    if (!program || !wallet) return;
    try {
      setCancelling(true);
      setCancelSt(null);
      const tx = await program.methods
        .cancel()
        .accounts({
          maker: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setCancelSt({ sig: tx, ok: true, msg: "" });
      onAction();
    } catch (e: any) {
      setCancelSt({ sig: "", ok: false, msg: e.message });
    } finally {
      setCancelling(false);
    }
  };

  const s = STATUS[statusKey] ?? STATUS.created;

  return (
    <div
      style={{
        border: `1px solid ${open ? C.border2 : C.border}`,
        marginBottom: 6,
        transition: "border-color .15s, background .15s",
        background: open ? "#0c0c0c" : C.surface,
      }}
    >
      {/* header row */}
      <div
        onClick={() => setOpen((x) => !x)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 18px",
          cursor: "pointer",
          flexWrap: "wrap",
        }}
      >
        {/* id */}
        <span
          style={{
            fontSize: 11,
            color: C.mutedFg,
            letterSpacing: ".1em",
            flexShrink: 0,
          }}
        >
          #{escrow.account.escrowId.toString()}
        </span>
        {/* status + amount */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: 1,
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          <Chip status={statusKey} />
          <span style={{ fontSize: 13, color: C.fg }}>{sol} SOL</span>
          <span style={{ fontSize: 12, color: C.mutedFg }}>
            → {short(escrow.account.reciver.toBase58())}
          </span>
        </div>
        {/* deadline */}
        <span
          style={{
            fontSize: 11,
            color: isPast && isActive ? "#ef4444" : C.mutedFg,
            flexShrink: 0,
          }}
          className="hide-sm"
        >
          {deadline.toLocaleDateString()}
        </span>
        {/* address */}
        <span
          style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}
          className="hide-sm"
        >
          {short(escrow.publicKey.toBase58())}
        </span>
        {/* chevron */}
        <span
          style={{
            color: C.muted,
            fontSize: 10,
            flexShrink: 0,
            transition: "transform .2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          ▼
        </span>
      </div>

      {/* expanded detail */}
      {open && (
        <div
          className="fu"
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "20px 18px",
            background: "#080808",
          }}
        >
          {/* gradient accent bar */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg,${s.color},transparent)`,
              marginBottom: 18,
              opacity: 0.5,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))",
              gap: "14px 20px",
              marginBottom: 20,
            }}
          >
            {(
              [
                [
                  "Escrow Account",
                  short(escrow.publicKey.toBase58()),
                  addrUrl(escrow.publicKey.toBase58()),
                ],
                [
                  "Maker",
                  short(escrow.account.maker.toBase58()),
                  addrUrl(escrow.account.maker.toBase58()),
                ],
                [
                  "Receiver",
                  short(escrow.account.reciver.toBase58()),
                  addrUrl(escrow.account.reciver.toBase58()),
                ],
                ["Amount", `${sol} SOL`, null],
                ["Deadline", deadline.toLocaleString(), null],
                [
                  "Mint",
                  escrow.account.mint
                    ? short(escrow.account.mint.toBase58())
                    : "Native SOL",
                  null,
                ],
              ] as [string, string, string | null][]
            ).map(([lbl, val, link]) => (
              <div key={lbl}>
                <Lbl>{lbl}</Lbl>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: C.fg,
                      fontSize: 13,
                      textDecoration: "none",
                      borderBottom: `1px solid ${C.border2}`,
                    }}
                  >
                    {val} ↗
                  </a>
                ) : (
                  <div style={{ color: C.fg, fontSize: 13 }}>{val}</div>
                )}
              </div>
            ))}
          </div>

          {isMaker && isActive && (
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <Lbl>Actions</Lbl>
              <Btn
                variant="red"
                size="sm"
                loading={cancelling}
                onClick={doCancel}
              >
                Cancel Escrow
              </Btn>
              <TxBox status={cancelSt} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Panel({
  children,
  accent = "purple",
  style,
  id,
}: {
  children: React.ReactNode;
  accent?: "purple" | "cyan" | "green" | "red" | "gradient";
  style?: React.CSSProperties;
  id?: string;
}) {
  const topColors: Record<string, string> = {
    purple: SOL.purple,
    cyan: SOL.cyan,
    green: SOL.green,
    red: "#ef4444",
    gradient: "linear-gradient(90deg,#9945FF,#00C2FF,#14F195)",
  };
  return (
    <div
      id={id}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid transparent`,
        backgroundImage: `linear-gradient(${C.card},${C.card}),${topColors[accent]}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box,border-box",
        borderTopColor:
          accent === "gradient" ? "transparent" : topColors[accent],
        padding: 28,
        ...style,
      }}
    >
      {accent === "gradient" && (
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg,#9945FF,#00C2FF,#14F195)",
            marginTop: -28,
            marginLeft: -28,
            marginRight: -28,
            marginBottom: 28,
          }}
        />
      )}
      {children}
    </div>
  );
}

export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <Lbl>{label}</Lbl>
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={{
          width: "100%",
          background: focused ? "#0e0e0e" : C.surface,
          border: `1px solid ${focused ? SOL.purpleBorder : C.border}`,
          boxShadow: focused ? `0 0 0 2px rgba(153,69,255,.08)` : "none",
          color: C.fg,
          padding: "9px 12px",
          fontSize: 13,
          outline: "none",
          transition: "all .15s",
          colorScheme: "dark",
          ...props.style,
        }}
      />
    </div>
  );
}
