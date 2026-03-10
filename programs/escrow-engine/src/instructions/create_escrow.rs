use crate::state::{Escrow, EscrowStatus};
use crate::error::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(
    escrow_id:u64, 
    reciver: Pubkey,
    amount: u64,
    deadline: i64,
    mint: Option<Pubkey>,
)]

pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        init,
        payer= maker,
        space= Escrow::LEN,
        seeds=[
            b"escrow",
            maker.key().as_ref(),
            &escrow_id.to_le_bytes()
            ],
            bump
    )]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateEscrow>,
    escrow_id: u64,
    reciver: Pubkey,
    amount: u64,
    deadline: i64,
    mint: Option<Pubkey>,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let current_time = Clock::get()?.unix_timestamp;

    require!(amount>0, ErrorCode::InvalidAmount);
    require!(deadline>current_time,ErrorCode::InvalidDeadline);

    escrow.maker = ctx.accounts.maker.key();
    escrow.reciver = reciver; 
    escrow.mint = mint;
    escrow.amount = amount;
    escrow.deadline = deadline;
    escrow.escrow_id = escrow_id;
    escrow.bump = ctx.bumps.escrow;

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.maker.key(),
        &escrow.key(),
        amount,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.maker.to_account_info(),
            escrow.to_account_info(),
        ],
    )?;
    escrow.status = EscrowStatus::Funded;

    msg!("account creted succussfully!");
    Ok(())
}
