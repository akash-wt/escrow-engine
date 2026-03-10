"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { short } from "../utils";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { C, NAV, SOL } from "./variables";

export default function useHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { publicKey } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        background: scrolled ? "rgba(0,0,0,.97)" : "rgba(0,0,0,.7)",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all .2s",
      }}
    >
      {scrolled && (
        <div
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(153,69,255,.3),rgba(20,241,149,.3),transparent)",
          }}
        />
      )}

      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "0 20px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* logo */}
        <a href="#" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span className="vt" style={{ fontSize: 24, letterSpacing: ".04em" }}>
            <span style={{ color: C.white }}>ESCROW</span>
            <span
              style={{
                background: "linear-gradient(90deg,#9945FF,#00C2FF,#14F195)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ::ENGINE
            </span>
          </span>
        </a>

        {/* desktop nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: 2 }}
          className="hide-sm"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{
                color: C.mutedFg,
                textDecoration: "none",
                fontSize: 12,
                letterSpacing: ".05em",
                padding: "6px 10px",
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fg)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.mutedFg)}
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {publicKey && (
            <span
              className="hide-sm"
              style={{
                fontSize: 11,
                color: SOL.green,
                letterSpacing: ".08em",
                display: "flex",
                alignItems: "center",
                gap: 5,
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
          <WalletMultiButton />
          {/* hamburger */}
          <button
            onClick={() => setMobileOpen((x) => !x)}
            className="hide-desktop"
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.fg,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div
          className="mobile-drawer"
          style={{
            borderTop: `1px solid ${C.border}`,
            background: "rgba(0,0,0,.99)",
            padding: "8px 20px 18px",
          }}
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                color: C.mutedFg,
                textDecoration: "none",
                fontSize: 14,
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
                letterSpacing: ".04em",
              }}
            >
              {n.label}
            </a>
          ))}
          {publicKey && (
            <div style={{ paddingTop: 12, fontSize: 11, color: SOL.green }}>
              ● {short(publicKey.toBase58())}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
