# 🧱 GitHub-Ready Templates: Solana Developer Projects

This document provides starter layouts for **two complete Solana developer projects**:
- Token-Staking DAO with Governance
- Crowdsourced Bounty Platform with Escrow and Multisig

---

## 📁 Project 1: Token-Staking DAO with Governance

**Folder Structure:**
```bash
staking_dao_project/
├── Anchor.toml
├── programs/
│   └── staking_dao/
│       ├── Cargo.toml
│       └── src/lib.rs
├── tests/
│   └── staking_dao.ts
├── migrations/
│   └── deploy.ts
├── ts/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── client.ts
```

**Smart Contract Modules (`lib.rs`):**
```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Token, Transfer};

declare_id!("DAO111111111111111111111111111111111111111");

#[program]
pub mod staking_dao {
    use super::*;

    pub fn initialize_stake_account(ctx: Context<InitializeStakeAccount>) -> Result<()> {
        let stake = &mut ctx.accounts.stake_account;
        stake.authority = *ctx.accounts.user.key;
        stake.amount = 0;
        stake.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token.to_account_info(),
                to: ctx.accounts.vault_token.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;
        ctx.accounts.stake_account.amount += amount;
        Ok(())
    }

    // Add unstake, claim_rewards, create_proposal, vote, etc.
}

#[account]
pub struct StakeAccount {
    pub authority: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[derive(Accounts)]
pub struct InitializeStakeAccount<'info> {
    #[account(init, payer = user, space = 8 + 40)]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
```

---

## 📁 Project 2: Crowdsourced Bounty Platform with Escrow and Multisig

**Folder Structure:**
```bash
bounty_platform_project/
├── Anchor.toml
├── programs/
│   └── bounty_board/
│       ├── Cargo.toml
│       └── src/lib.rs
├── tests/
│   └── bounty_board.ts
├── migrations/
│   └── deploy.ts
├── ts/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── client.ts
```

**Smart Contract Modules (`lib.rs`):**
```rust
use anchor_lang::prelude::*;

declare_id!("BOUNTY11111111111111111111111111111111111111");

#[program]
pub mod bounty_board {
    use super::*;

    pub fn post_bounty(ctx: Context<PostBounty>, reward: u64, deadline: i64) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty_account;
        bounty.creator = *ctx.accounts.creator.key;
        bounty.reward = reward;
        bounty.deadline = deadline;
        bounty.status = 0;
        Ok(())
    }
}

#[account]
pub struct BountyAccount {
    pub creator: Pubkey,
    pub reward: u64,
    pub deadline: i64,
    pub status: u8,
}

#[derive(Accounts)]
pub struct PostBounty<'info> {
    #[account(init, payer = creator, space = 8 + 48)]
    pub bounty_account: Account<'info, BountyAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

---

## 🧪 Testing (staking_dao.ts and bounty_board.ts)
```ts
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { StakingDao } from "../target/types/staking_dao";

describe("staking_dao", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.StakingDao as Program<StakingDao>;

  it("Initializes stake account", async () => {
    const stakeAccount = anchor.web3.Keypair.generate();
    await program.methods.initializeStakeAccount()
      .accounts({ stakeAccount: stakeAccount.publicKey, user: provider.wallet.publicKey })
      .signers([stakeAccount])
      .rpc();
    const stake = await program.account.stakeAccount.fetch(stakeAccount.publicKey);
    console.log("Stake owner:", stake.authority.toBase58());
  });
});
```

---

## 📘 README.md Example
```markdown
# Staking DAO

A Solana program using Anchor that lets users stake SPL tokens, earn rewards, and vote on DAO proposals.

## 🛠 Install
```bash
yarn install
anchor build
anchor test
```

## 📦 Features
- Stake SPL tokens
- Earn rewards over time
- Propose and vote on governance decisions
- Uses Anchor + anchor_spl + TypeScript tests
```

---

## ✅ What’s Next?
- Add DAO frontend
- Connect to devnet via Phantom
- Submit to Solana hackathon or job portfolio
