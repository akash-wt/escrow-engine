import { useWallet } from "@solana/wallet-adapter-react";
import { addrUrl, programId, short } from "../utils";
import { Lbl } from "./functions";
import { C, SOL } from "./variables";

export function Hero() {
  const { publicKey } = useWallet();
  return (
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
        Trustless, non-custodial escrow protocol on Solana. Lock funds, define
        conditions, release with confidence.
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
              <div style={{ color: color ?? C.fg, fontSize: 13 }}>{value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
