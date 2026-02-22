use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode{
    #[msg("amount must be greater the zeor")]
    InvalidAmount,

}