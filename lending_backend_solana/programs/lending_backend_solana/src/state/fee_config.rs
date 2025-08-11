use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct FeeRule {
    pub id: u8,
    pub basis_points: u16,
    pub recipient: Pubkey,
    pub enabled: bool,
}

#[account]
pub struct FeeConfig {
    pub admin: Pubkey,
    pub fees: Vec<FeeRule>,
}
