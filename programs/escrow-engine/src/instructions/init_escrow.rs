use crate::{error::ErrorCode, state::Escrow};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(escorw_id:u64)]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        init,
        payer= maker,
        space= Escrow::LEN,
        seeds=[
            b"escrow",
            maker.key().as_ref(),
            &escorw_id.to_le_bytes()
            ],
            bump
    )]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeEscrow>, escrow_id: u64) -> Result<()> {
    Ok(())
}
