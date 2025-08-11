#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub amount: u64,
    pub waived_fees: Vec<u8>, // Fee IDs waived
    pub fee_config: Pubkey,
    pub created_at: i64,
    pub is_active: bool,
}
