use crate::error::ErrorCode;
use crate::state::{Escrow, EscrowStatus};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub receiver: Signer<'info>,
    #[account(
       mut,
       close=receiver,
        seeds=[
            b"escrow",
            escrow.maker.as_ref(),
            &escrow.escrow_id.to_le_bytes()
            ],
           bump= escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Claim>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let now = Clock::get()?.unix_timestamp;

    require!(
        escrow.status == EscrowStatus::Funded,
        ErrorCode::InvalidState
    );

    require!(
        escrow.reciver == ctx.accounts.receiver.key(),
        ErrorCode::Unauthorized
    );

    require!(now >= escrow.deadline, ErrorCode::BeforeDeadline);

    escrow.status = EscrowStatus::Claimed;

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &escrow.key(),
        &ctx.accounts.receiver.key(),
        escrow.amount,
    );
    anchor_lang::solana_program::program::invoke_signed(
        &ix,
        &[
            escrow.to_account_info(),
            ctx.accounts.receiver.to_account_info(),
        ],
        &[&[
            b"escrow",
            escrow.maker.as_ref(),
            &escrow.escrow_id.to_le_bytes(),
            &[escrow.bump],
        ]],
    )?;

    Ok(())
}
