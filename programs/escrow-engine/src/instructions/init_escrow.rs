use anchor_lang::prelude::*;
// use crate::{state::Escrow,error::ErrorCode};

#[derive(Accounts)]
#[instruction(escorw_id:i64)]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    // #[account(
    //     init,
    //     pa

    // )]
}

pub fn handler(ctx: Context<InitializeEscrow>, escrow_id: i64) -> Result<()> {
    Ok(())
}
