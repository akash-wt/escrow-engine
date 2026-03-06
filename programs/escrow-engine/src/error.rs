use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Escrow amount must be greater than zero.")]
    InvalidAmount,

    #[msg("The provided deadline must be a future timestamp.")]
    InvalidDeadline,

    #[msg("Escrow is in an invalid state for this operation.")]
    InvalidState,

    #[msg("Only the escrow maker is authorized to perform this action.")]
    InvalidMaker,

    #[msg("The escrow deadline has already passed.")]
    DeadlinePassed,

    #[msg("The escrow amount only can receive receiver.")]
    Unauthorized,

    #[msg("The escrow amount can not be claimed before deadline")]
    BeforeDeadline,
}
