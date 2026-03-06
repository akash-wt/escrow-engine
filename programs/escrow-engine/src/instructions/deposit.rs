use crate::error::ErrorCode;
use crate::instructions::deposit;
use crate::state::{Escrow, EscrowStatus};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Deposite<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
       mut,
        seeds=[
            b"escrow",
            maker.key().as_ref(),
            &escrow.escrow_id.to_le_bytes()
            ],
           bump= escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

fn handler(ctx: Context<Deposite>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(
        escrow.status == EscrowStatus::Created,
        ErrorCode::InvalidState
    );

    require!(
        escrow.maker == ctx.accounts.maker.key(),
        ErrorCode::InvalidMaker
    );

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.maker.key(),
        &escrow.key(),
        escrow.amount,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.maker.to_account_info(),
            escrow.to_account_info(),
        ],
    )?;
    escrow.status = EscrowStatus::Funded;

    Ok(())
}
