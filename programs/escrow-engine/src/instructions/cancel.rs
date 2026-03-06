use crate::error::ErrorCode;
use crate::state::{Escrow, EscrowStatus};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Cancel<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
       mut,
       close=maker,
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

pub fn handler(ctx: Context<Cancel>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let now = Clock::get()?.unix_timestamp;

    require!(
        escrow.status == EscrowStatus::Funded,
        ErrorCode::InvalidState
    );

    require!(
        escrow.maker == ctx.accounts.maker.key(),
        ErrorCode::InvalidMaker
    );

    require!(now < escrow.deadline, ErrorCode::DeadlinePassed);

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &escrow.key(),
        &ctx.accounts.maker.key(),
        escrow.amount,
    );

    let escrow_info = escrow.to_account_info();
    let maker_info = ctx.accounts.maker.to_account_info();

    **escrow_info.try_borrow_mut_lamports()? -= escrow.amount;
    **maker_info.try_borrow_mut_lamports()? += escrow.amount;
    
    escrow.status = EscrowStatus::Cancelled;

    Ok(())
}
