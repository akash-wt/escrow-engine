use crate::state::{Escrow, EscrowStatus};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(escrow_id:u64)]
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
            &escrow_id.to_le_bytes()
            ],
            bump
    )]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeEscrow>, escrow_id: u64) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    escrow.maker = ctx.accounts.maker.key();
    escrow.reciver = Pubkey::default(); // it will be passed
    escrow.mint = None;
    escrow.amount = 0;
    escrow.deadline = 0;
    escrow.escrow_id = escrow_id;
    escrow.bump = ctx.bumps.escrow;
    escrow.status = EscrowStatus::Created;

    msg!("account creted succussfully!");
    Ok(())
}
