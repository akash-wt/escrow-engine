import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EscrowEngine } from "../target/types/escrow_engine";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("escrow-engine", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const receiver = Keypair.generate();
  const program = anchor.workspace.escrowEngine as Program<EscrowEngine>;

  it("Escrow_test", async () => {
    const escrowId = new anchor.BN(1);
    const amount = new anchor.BN(1_000_000_000); // 1 SOL
    const deadline = new anchor.BN(
      Math.floor(Date.now() / 1000) + 60
    ); // 1 minute later

    const tx = await program.methods.createEscrow(escrowId, receiver.publicKey, amount, deadline, null).accounts(
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

    if (!escrowAccount.maker.equals(provider.wallet.publicKey)) {
      throw new Error("Maker not stored correctly");
    }

    if (escrowAccount.escrowId.toNumber() !== 1) {
      throw new Error("Escrow ID mismatch");
    }

    if (escrowAccount.status.funded === undefined) {
      throw new Error("Escrow status incorrect");
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

    const escrowAccount = await program.account.escrow.fetchNullable(escrowPda);
    if (escrowAccount !== null) {
      throw new Error("Escrow account should be closed");
    }

  });

  it("claim_test", async () => {
    const escrowId = new anchor.BN(1);

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        provider.wallet.publicKey.toBuffer(),
        escrowId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const tx = await program.methods.claim().accounts({
      receiver: receiver.publicKey,
      escrow: escrowPda
    })
      .signers([receiver]).rpc();

    const balance = await provider.connection.getBalance(receiver.publicKey);

    const escrowAccount = await program.account.escrow.fetchNullable(escrowPda);
    if (escrowAccount == null) {
      throw new Error("Escrow account should be closed");
    }

  });
});

