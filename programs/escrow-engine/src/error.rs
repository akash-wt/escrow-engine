use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Amount must be greater the zero!")]
    InvalidAmount,

    #[msg("Invalid deadline provided!")]
    InvalidDeadline,

    #[msg("Invalid state of escrow!")]
    InvalidState,

    #[msg("Unauthorized pubkey mismatch!")]
    InvalidMaker,
}
