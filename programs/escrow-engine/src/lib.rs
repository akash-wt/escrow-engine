use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("7Brc92uzycCySEN6Ma6G7qFRapDTkSiw7HZG2roqq2nb");

#[program]
pub mod escrow_engine {
    use super::*;

    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        escrow_id: u64,
        reciver: Pubkey,
        amount: u64,
        deadline: i64,
        mint: Option<Pubkey>,
    ) -> Result<()> {
        let _ = instructions::init_escrow::handler(ctx, escrow_id, reciver, amount, deadline, mint);
        Ok(())
    }
}
