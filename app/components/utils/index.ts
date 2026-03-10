
export const short = (pk: string) => `${pk.slice(0, 4)}…${pk.slice(-4)}`;
export const txUrl = (sig: string) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
export const addrUrl = (a: string) => `https://explorer.solana.com/address/${a}?cluster=devnet`;
export type TxStatus = { sig: string; ok: boolean; msg: string } | null;
export const programId = "7Brc92uzycCySEN6Ma6G7qFRapDTkSiw7HZG2roqq2nb"