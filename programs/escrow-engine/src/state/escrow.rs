use anchor_lang::prelude::*;

//  intSpace help us to calculate escrow struct

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    // who made the escrow
    pub maker: Pubkey,
    // reciver of escrow amount
    pub reciver: Pubkey,
    // token or  native sol
    pub mint: Option<Pubkey>, // None = Native SOL
    // amount of escrow
    pub amount: u64,
    // deadline of escorw
    pub deadline: i64,
    // escrow id
    pub escrow_id: u64,
    // bump of this escrow pda
    pub bump: u8,
    // Stauts of escrow
    pub status: EscrowStatus,
}

impl Escrow {
    pub const LEN: usize = Escrow::INIT_SPACE;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum EscrowStatus {
    Created,
    Funded,
    Claimed,
    Cancelled,
}
