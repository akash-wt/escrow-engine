import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Program } from "@anchor-lang/core";
import type { EscrowEngine } from "./escrow_engine";
import idl from "./escrow_engine.json";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
export const program = new Program(idl as EscrowEngine, {
    connection,
});