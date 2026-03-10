"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../hooks/useProgram";
import { useCallback, useEffect, useState } from "react";
import { C, SOL } from "../style/variables";
import { Btn, Empty, EscrowCard } from "../style/functions";

type Fil = "all" | "created" | "funded" | "claimed" | "cancelled";

export function MyEscrows({ rk }: { rk: number }) {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fil, setFil] = useState<Fil>("all");
  const [tick, setTick] = useState(0);

  const load = useCallback(async () => {
    if (!program || !publicKey) return;
    try {
      setLoading(true);
      const all = await (program.account as any).escrow.all([
        { memcmp: { offset: 8, bytes: publicKey.toBase58() } },
      ]);
      all.sort(
        (a: any, b: any) =>
          b.account.escrowId.toNumber() - a.account.escrowId.toNumber(),
      );
      setEscrows(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  useEffect(() => {
    load();
  }, [load, rk, tick]);

  const TABS: { k: Fil; label: string; color: string }[] = [
    { k: "all", label: "All", color: C.dimFg },
    { k: "created", label: "Created", color: SOL.cyan },
    { k: "funded", label: "Funded", color: SOL.green },
    { k: "claimed", label: "Claimed", color: SOL.purple },
    { k: "cancelled", label: "Cancelled", color: "#ef4444" },
  ];

  const cnt = (k: Fil) =>
    k === "all"
      ? escrows.length
      : escrows.filter((e) => Object.keys(e.account.status)[0] === k).length;
  const shown =
    fil === "all"
      ? escrows
      : escrows.filter((e) => Object.keys(e.account.status)[0] === fil);

  return (
    <div id="my-escrows">
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".18em",
              color: C.mutedFg,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            on-chain · devnet
          </div>
          <h2
            className="vt"
            style={{
              fontSize: "clamp(30px,5vw,48px)",
              color: C.white,
              letterSpacing: ".02em",
              lineHeight: 1,
            }}
          >
            My Escrows
          </h2>
        </div>
        <Btn
          variant="ghost"
          size="sm"
          loading={loading}
          onClick={() => setTick((k) => k + 1)}
        >
          ↻ Refresh
        </Btn>
      </div>

      {/* filter tabs */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {TABS.map(({ k, label, color }) => {
          const active = fil === k;
          return (
            <button
              key={k}
              onClick={() => setFil(k)}
              style={{
                background: active ? "#111" : "transparent",
                border: `1px solid ${active ? color + "66" : C.border}`,
                color: active ? color : C.mutedFg,
                padding: "5px 12px",
                fontSize: 12,
                fontFamily: "'IBM Plex Mono',monospace",
                letterSpacing: ".06em",
                cursor: "pointer",
                transition: "all .15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {label}
              <span
                style={{
                  background: active ? color + "20" : C.border,
                  color: active ? color : C.mutedFg,
                  padding: "0 5px",
                  fontSize: 10,
                  borderRadius: 2,
                }}
              >
                {cnt(k)}
              </span>
            </button>
          );
        })}
      </div>

      {/* list */}
      {!publicKey ? (
        <Empty>Connect your wallet to view your escrows</Empty>
      ) : loading ? (
        <Empty>
          <span
            style={{
              width: 14,
              height: 14,
              border: `1.5px solid ${C.mutedFg}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: 10,
            }}
            className="sp"
          />
          Fetching from chain…
        </Empty>
      ) : shown.length === 0 ? (
        <Empty>No escrows found</Empty>
      ) : (
        shown.map((e) => (
          <EscrowCard
            key={e.publicKey.toBase58()}
            escrow={e}
            onAction={() => setTick((k) => k + 1)}
          />
        ))
      )}
    </div>
  );
}
