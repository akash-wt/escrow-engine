"use client";
import { useState } from "react";
import { MyEscrows } from "@/components/methods/myEscrow";
import Header from "@/components/style/header";
import { C } from "@/components/style/variables";
import { GradDivider } from "@/components/style/functions";
import { CreateEscrow } from "@/components/methods/createEscrow";
import { Claim } from "@/components/methods/claim";
import { CancelInstruction } from "@/components/methods/cancel";
import { Hero } from "@/components/style/hero";
import { Footer } from "@/components/style/footer";

export default function Home() {
  const [rk, setRk] = useState(0);
  const refresh = () => setRk((k) => k + 1);

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header></Header>
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
        <Hero></Hero>

        <div style={{ padding: "56px 0 48px" }}>
          <MyEscrows rk={rk} />
        </div>
        <GradDivider />

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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 80,
          }}
        >
          <CreateEscrow onDone={refresh} />
          <Claim onDone={refresh} />
          <CancelInstruction onDone={refresh} />
        </div>
      </main>

      <Footer></Footer>
    </div>
  );
}
