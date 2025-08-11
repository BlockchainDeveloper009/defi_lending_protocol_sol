use anchor_lang::prelude::*;
use anchor_spl::token_interface::{TokenAccount, Mint, TokenInterface, TransferChecked, transfer_checked};

use crate::state::{FeeConfig, User, FeeRule};
//use crate::error::ErrorCode;

pub fn apply_fees_and_transfer<'info>(
    user: &User,
    fee_config: &FeeConfig,
    amount: u64,
    mint: &InterfaceAccount<'info, Mint>,
    token_program: &Interface<'info, TokenInterface>,
    bank_token_account: &InterfaceAccount<'info, TokenAccount>,
    fee_receiver_token_account: &InterfaceAccount<'info, TokenAccount>,
    signer_seeds: &[&[&[u8]]],
) -> Result<u64> {
    let decimals = mint.decimals;
    let mut total_fee = 0u64;

    for rule in &fee_config.fees {
        if !rule.enabled || user.waived_fee_ids.contains(&rule.id) {
            continue;
        }

        let multiplier_bps = user.fee_multiplier_bps.unwrap_or(100) as u128;
        let effective_fee_bps = (rule.basis_points as u128 * multiplier_bps) / 100;
        let fee_amount = ((amount as u128 * effective_fee_bps) / 10_000) as u64;

        total_fee = total_fee
            .checked_add(fee_amount)
            .ok_or(ErrorCode::MathOverflow)?;

        let transfer_accounts = TransferChecked {
            from: bank_token_account.to_account_info(),
            mint: mint.to_account_info(),
            to: fee_receiver_token_account.to_account_info(),
            authority: bank_token_account.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            token_program.to_account_info(),
            transfer_accounts,
        )
        .with_signer(signer_seeds);

        transfer_checked(cpi_ctx, fee_amount, decimals)?;
    }

    let net_amount = amount.checked_sub(total_fee).ok_or(ErrorCode::MathOverflow)?;
    Ok(net_amount)
}

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow occurred during fee calculation or transfer.")]
    MathOverflow,
    #[msg("Invalid fee configuration or user state.")]
    InvalidFeeConfig,
    #[msg("Unauthorized operation attempted.")]
    Unauthorized,
}