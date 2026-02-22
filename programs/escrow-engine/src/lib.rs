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
        escrow_id: i64
        ) -> Result<()> {
        instructions::InitializeEscrow::handler()
    }
}

#[derive(Accounts)]
pub struct Initialize {}
