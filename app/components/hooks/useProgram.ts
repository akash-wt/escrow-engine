import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import type { EscrowEngine } from "../helper/escrow_engine";
import idl from "../helper/escrow_engine.json";

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    return new Program(idl as EscrowEngine);
  }, [connection, wallet]);

  return program;
}