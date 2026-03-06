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
        instructions::init_escrow::handler(ctx, escrow_id, reciver, amount, deadline, mint)?;
        Ok(())
    }

    pub fn deposite(ctx: Context<Deposite>) -> Result<()> {
        instructions::deposit::handler(ctx)?;
        Ok(())
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        instructions::cancel::handler(ctx)?;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        instructions::claim::handler(ctx)?;
        Ok(())
    }
}
