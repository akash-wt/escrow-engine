import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EscrowEngine } from "../target/types/escrow_engine";
import { PublicKey } from "@solana/web3.js";

describe("escrow-engine", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.escrowEngine as Program<EscrowEngine>;

  it("Initialize Escrow", async () => {
    const escrow_id = new anchor.BN(1);
    const tx = await program.methods.initializeEscrow(escrow_id).accounts(
      {
        maker: provider.wallet.publicKey,
      }
    ).rpc();
    
    console.log("Your transaction signature", tx);

    const escrowId = new anchor.BN(1);

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
});
