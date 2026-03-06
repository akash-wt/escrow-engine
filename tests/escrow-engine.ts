import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EscrowEngine } from "../target/types/escrow_engine";
import { PublicKey } from "@solana/web3.js";

describe("escrow-engine", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const receiver = provider.wallet.publicKey;
  const program = anchor.workspace.escrowEngine as Program<EscrowEngine>;

  it("Initialize_Escrow_test", async () => {
    const escrowId = new anchor.BN(1);
    const amount = new anchor.BN(1_000_000_000); // 1 SOL
    const deadline = new anchor.BN(
      Math.floor(Date.now() / 1000) + 60
    ); // 1 minute later

    const tx = await program.methods.initializeEscrow(escrowId, receiver, amount, deadline, null).accounts(
      {
        maker: provider.wallet.publicKey,
      }
    ).rpc();

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        provider.wallet.publicKey.toBuffer(),
        escrowId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const escrowAccount = await program.account.escrow.fetch(escrowPda);

    console.log(escrowAccount);

    if (!escrowAccount.maker.equals(provider.wallet.publicKey)) {
      throw new Error("Maker not stored correctly");
    }

    if (escrowAccount.escrowId.toNumber() !== 1) {
      throw new Error("Escrow ID mismatch");
    }

    if (escrowAccount.status.created === undefined) {
      throw new Error("Escrow status incorrect");
    }

  });

  it("Deposite_test", async () => {
    const escrowId = new anchor.BN(1);

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        provider.wallet.publicKey.toBuffer(),
        escrowId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const tx = await program.methods.deposite().accounts({
      maker: provider.wallet.publicKey,
      escrow: escrowPda
    }).rpc();

    console.log("deposite tx: ", tx);

    const escrowAccount = await program.account.escrow.fetch(escrowPda);

    console.log("after deposite escrowAccount", escrowAccount);

    if (!escrowAccount.maker.equals(provider.wallet.publicKey)) {
      throw new Error("Maker not stored correctly");
    }

    if (escrowAccount.escrowId.toNumber() !== 1) {
      throw new Error("Escrow ID mismatch");
    }

    if (escrowAccount.status.funded === undefined) {
      throw new Error("Escrow status should be funded");
    }

  });

  it("cancel_test", async () => {
    const escrowId = new anchor.BN(1);

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        provider.wallet.publicKey.toBuffer(),
        escrowId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const tx = await program.methods.cancel().accounts({
      maker: provider.wallet.publicKey,
      escrow: escrowPda
    }).rpc();

    console.log("deposite tx: ", tx);

    const escrowAccount = await program.account.escrow.fetch(escrowPda);

    console.log("after deposite escrowAccount", escrowAccount);

    if (!escrowAccount.maker.equals(provider.wallet.publicKey)) {
      throw new Error("Maker not stored correctly");
    }

    if (escrowAccount.escrowId.toNumber() !== 1) {
      throw new Error("Escrow ID mismatch");
    }

    if (escrowAccount.status.cancelled === undefined) {
      throw new Error("Escrow status should be funded");
    }

  });
});
