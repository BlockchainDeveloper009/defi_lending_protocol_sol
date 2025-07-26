use anchor_lang::prelude::*;

declare_id!("CHoptLtk8eyutQoj5PKaqcA73ALiAqPoAZV5HbFNqSU1");
#[program]
pub mod mock_pyth_oracle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, price: i64, expo: i32) -> Result<()> {
        let feed = &mut ctx.accounts.price_feed;
        feed.price = price;
        feed.expo = expo;
        Ok(())
    }

    pub fn update_price(ctx: Context<UpdatePrice>, new_price: i64) -> Result<()> {
        let feed = &mut ctx.accounts.price_feed;
        feed.price = new_price;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + PriceFeed::SIZE)]
    pub price_feed: Account<'info, PriceFeed>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePrice<'info> {
    #[account(mut)]
    pub price_feed: Account<'info, PriceFeed>,
    pub user: Signer<'info>,
}

#[account]
pub struct PriceFeed {
    pub price: i64,   // e.g., 4300000 for $43.00000
    pub expo: i32,    // e.g., -5 for 5 decimal places
}

impl PriceFeed {
    pub const SIZE: usize = 8 + 4; // i64 + i32
}
