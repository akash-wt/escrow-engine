"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { BN, Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import idl from "@/components/helper/escrow_engine.json";
import type { EscrowEngine } from "@/components/helper/escrow_engine";
import { short, txUrl, addrUrl, TxStatus } from "@/components/utils";
import InitEscrow from "@/components/methods/initEscrow";
import Deposit from "@/components/methods/deposite";
import Claim from "@/components/methods/claim";
import CancelInstruction from "@/components/methods/cancel";
import { useProgram } from "@/components/hooks/useProgram";
import { MyEscrows } from "@/components/methods/myEscrow";





const SOL = {
  purple: "#9945FF",
  cyan: "#00C2FF",
  green: "#14F195",
  // derived tints
  purpleDim: "rgba(153,69,255,0.15)",
  cyanDim: "rgba(0,194,255,0.12)",
  greenDim: "rgba(20,241,149,0.12)",
  purpleBorder: "rgba(153,69,255,0.35)",
  cyanBorder: "rgba(0,194,255,0.3)",
  greenBorder: "rgba(20,241,149,0.3)",
};



/* ─── status map using Solana tones ────────────────────────── */
const STATUS: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  created: {
    color: SOL.cyan,
    bg: SOL.cyanDim,
    border: SOL.cyanBorder,
    label: "Created",
  },
  funded: {
    color: SOL.green,
    bg: SOL.greenDim,
    border: SOL.greenBorder,
    label: "Funded",
  },
  claimed: {
    color: SOL.purple,
    bg: SOL.purpleDim,
    border: SOL.purpleBorder,
    label: "Claimed",
  },
  cancelled: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    label: "Cancelled",
  },
};

/** Tiny uppercase label */
function Lbl({ children }: { children: React.ReactNode }) {
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

/** Solana-gradient top-border card */
function Panel({
  children,
  accent = "purple",
  style,
}: {
  children: React.ReactNode;
  accent?: "purple" | "cyan" | "green" | "red" | "gradient";
  style?: React.CSSProperties;
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
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid transparent`,
        backgroundImage: `linear-gradient(${C.card},${C.card}),${topColors[accent]}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box,border-box",
        // simpler fallback – just set border-top colour
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

/** Input field */
function Field({
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

/** Button */
type BtnVariant = "purple" | "cyan" | "green" | "red" | "ghost";
function Btn({
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

/** Status badge */
function Chip({ status }: { status: string }) {
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

/** TX result block */
function TxBox({ status }: { status: TxStatus }) {
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

/** Section divider with gradient line */
function GradDivider() {
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

/** Section header */
function SHead({
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

/** Info note */
function Note({
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


/* ─── ESCROW CARD ────────────────────────────────────────────── */
function EscrowCard({
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

/* ─── MY ESCROWS ─────────────────────────────────────────────── */
type Fil = "all" | "created" | "funded" | "claimed" | "cancelled";



function Empty({ children }: { children: React.ReactNode }) {
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

/* ─── NAV ────────────────────────────────────────────────────── */


/* ─── PAGE ───────────────────────────────────────────────────── */
export default function Home() {
  const { publicKey } = useWallet();
 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rk, setRk] = useState(0);
  const refresh = () => setRk((k) => k + 1);
  const programId = (idl as any).address ?? "";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        

        {/* ─── MAIN ────────────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            maxWidth: 880,
            width: "100%",
            margin: "0 auto",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          {/* HERO */}
          <div
            style={{
              paddingTop: 116,
              paddingBottom: 80,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {/* network pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: `1px solid ${C.border2}`,
                padding: "4px 14px",
                marginBottom: 32,
                fontSize: 11,
                letterSpacing: ".12em",
                color: C.mutedFg,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: SOL.green,
                  display: "inline-block",
                }}
              />
              Solana Devnet &nbsp;·&nbsp; {programId ? short(programId) : "—"}
            </div>

            {/* headline */}
            <h1
              className="vt"
              style={{
                fontSize: "clamp(60px,12vw,112px)",
                lineHeight: 0.88,
                letterSpacing: ".01em",
                color: C.white,
                marginBottom: 28,
              }}
            >
              ON-CHAIN
              <br />
              <span className="grad">ESCROW</span>
              <br />
              ENGINE
            </h1>

            <p
              style={{
                color: C.mutedFg,
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 400,
                marginBottom: 36,
              }}
            >
              Trustless, non-custodial escrow protocol on Solana. Lock funds,
              define conditions, release with confidence.
            </p>

            {/* stat pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
              {[
                { label: "Network", value: "Devnet", color: undefined },
                {
                  label: "Program",
                  value: programId ? short(programId) : "—",
                  link: programId ? addrUrl(programId) : undefined,
                },
                { label: "Currency", value: "SOL", color: undefined },
                {
                  label: "Wallet",
                  value: publicKey ? "Connected" : "Disconnected",
                  color: publicKey ? SOL.green : C.mutedFg,
                },
              ].map(({ label, value, link, color }, i) => (
                <div
                  key={label}
                  style={{
                    padding: "13px 18px",
                    border: `1px solid ${C.border}`,
                    borderLeft: i === 0 ? `1px solid ${C.border}` : "none",
                    flex: "1 1 auto",
                    minWidth: 90,
                  }}
                >
                  <Lbl>{label}</Lbl>
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: C.fg,
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      {value} ↗
                    </a>
                  ) : (
                    <div style={{ color: color ?? C.fg, fontSize: 13 }}>
                      {value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MY ESCROWS */}
          <div style={{ padding: "56px 0 48px" }}>
            <MyEscrows rk={rk} />
          </div>

          <GradDivider />

          {/* WRITE OPS heading */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: ".2em",
                color: C.mutedFg,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              contract instructions
            </div>
            <h2
              className="vt"
              style={{
                fontSize: "clamp(28px,4vw,44px)",
                color: C.white,
                letterSpacing: ".02em",
              }}
            >
              Write Operations
            </h2>
          </div>

          {/* ONE-BY-ONE vertical stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 80,
            }}
          >
            <InitEscrow onDone={refresh} />
            <Deposit onDone={refresh} />
            <Claim onDone={refresh} />
            <CancelInstruction onDone={refresh} />
          </div>
        </main>

        {/* ─── FOOTER ──────────────────────────────────────────── */}
        <footer
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 200,
            background: "rgba(0,0,0,.97)",
            backdropFilter: "blur(14px)",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {/* gradient cap line */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(153,69,255,.25),rgba(0,194,255,.25),rgba(20,241,149,.25),transparent)",
            }}
          />
          <div
            style={{
              maxWidth: 880,
              margin: "0 auto",
              padding: "11px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span>
              <span className="vt" style={{ fontSize: 18, color: C.white }}>
                ESCROW
              </span>
              <span
                className="vt"
                style={{
                  fontSize: 18,
                  background: "linear-gradient(90deg,#9945FF,#14F195)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ::ENGINE
              </span>
              <span style={{ color: C.muted, fontSize: 11, marginLeft: 8 }}>
                © 2025
              </span>
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {programId && (
                <a
                  href={addrUrl(programId)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: C.mutedFg,
                    fontSize: 12,
                    textDecoration: "none",
                    letterSpacing: ".06em",
                    transition: "color .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = SOL.green)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = C.mutedFg)
                  }
                >
                  {short(programId)} ↗
                </a>
              )}
              <span
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                }}
              >
                Devnet
              </span>
              {publicKey && (
                <span
                  style={{
                    fontSize: 11,
                    color: SOL.green,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    letterSpacing: ".06em",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: SOL.green,
                      display: "inline-block",
                    }}
                  />
                  {short(publicKey.toBase58())}
                </span>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
