"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { addrUrl, programId, short } from "../utils";
import { C, SOL } from "./variables";

export function Footer() {
  const { publicKey } = useWallet();
  return (
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
              onMouseEnter={(e) => (e.currentTarget.style.color = SOL.green)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.mutedFg)}
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
  );
}
