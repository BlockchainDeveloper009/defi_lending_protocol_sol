use anchor_lang::prelude::*;
use anchor_spl::token_interface::{TokenInterface, TokenAccount, 
    TransferChecked, Mint};

#[constant]
pub const SEED: &str = "btc_swap";
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;


pub fn transfer_tokens<'info>(
    from: &InterfaceAccount<'info, TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    mint: &InterfaceAccount<'info, Mint>,
    authority: &Signer<'info>,
    token_program: &InterfaceAccount<'info, TokenInterface>,
) -> Result<()> {
    let transfer_instruction = TransferChecked {
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: authority.to_account_info(),
        mint: mint.to_account_info(),
        // token_program: token_program.to_account_info(),
        // amount,
        // decimals: mint.decimals,
    }

    let cpi_context = CpiContext::new(
        token_program.to_account_info(),
        transfer_instruction,
    );
    // Transfer tokens logic here
    transfer_checked(ctx: cpi_context, *amount, mint.decimals)?;
    
    Ok(())
}