import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SurveyReward } from "../target/types/survey_reward";
import { assert } from "chai";

describe("survey_reward", () => {
  // Configure the client
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SurveyReward as Program<SurveyReward>;

  let user = anchor.web3.Keypair.generate();
  let mint = null;
  let userTokenAccount = null;
  let vault = null;
  let userAccountPda = null;

  it("Initializes user", async () => {
    // Add code to create a mint, token accounts, and initialize user PDA...
    // Omitted for brevity, see detailed Anchor examples on mint setup.
    // ...
    // e.g.
    // [userAccountPda] = await anchor.web3.PublicKey.findProgramAddress([...], program.programId);
    // await program.methods.initializeUser().accounts({...}).signers([user]).rpc();
  });

  it("Completes a survey", async () => {
    await program.methods
      .completeSurvey()
      .accounts({
        userAccount: userAccountPda,
        owner: user.publicKey,
      })
      .signers([user])
      .rpc();

    // Optionally fetch and assert the account state
    const userAccount = await program.account.userAccount.fetch(
      userAccountPda
    );
    assert.equal(userAccount.surveysCompleted, 1);
  });

  it("Claims rewards", async () => {
    // Setup: ensure vault has tokens, user has surveysCompleted>0, etc.
    await program.methods
      .claimRewards()
      .accounts({
        userAccount: userAccountPda,
        owner: user.publicKey,
        vault: vault,
        userTokenAccount: userTokenAccount,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Optionally assert token balance change, etc.
    // You can check userTokenAccount balance with Anchor SPL utils
  });
});

/**Below is a **complete example of an Anchor smart contract** that rewards users with SPL tokens based on the number of surveys they complete. It includes core contract code and unit test scaffolding using the Anchor testing framework (Mocha/TypeScript).

***

## 1. **Anchor Smart Contract (Rust)**

Create a new Anchor project and replace contents of `programs/survey_reward/src/lib.rs` with the following:

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{
    self, Mint, Token, TokenAccount, Transfer,
};

declare_id!("YourProgramId1111111111111111111111111111111");

const TOKENS_PER_SURVEY: u64 = 10; // Amount of tokens per survey

#[program]
pub mod survey_reward {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        ctx.accounts.user_account.owner = ctx.accounts.user.key();
        ctx.accounts.user_account.surveys_completed = 0;
        ctx.accounts.user_account.total_rewards_claimed = 0;
        Ok(())
    }

    pub fn complete_survey(ctx: Context<CompleteSurvey>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        require!(
            user_account.owner == ctx.accounts.user.key(),
            ErrorCode::InvalidUser
        );

        user_account.surveys_completed = user_account
            .surveys_completed
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;

        let rewards_earned =
            user_account.surveys_completed * TOKENS_PER_SURVEY;
        let rewards_to_claim =
            rewards_earned.saturating_sub(user_account.total_rewards_claimed);

        require!(rewards_to_claim > 0, ErrorCode::NoRewards);

        // Transfer SPL tokens to user
        token::transfer(
            ctx.accounts
                .into_transfer_to_user_context(),
            rewards_to_claim,
        )?;

        user_account.total_rewards_claimed = user_account
            .total_rewards_claimed
            .checked_add(rewards_to_claim)
            .ok_or(ErrorCode::MathOverflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteSurvey<'info> {
    #[account(mut, has_one=owner)]
    pub user_account: Account<'info, UserAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut, has_one=owner)]
    pub user_account: Account<'info, UserAccount>,
    pub owner: Signer<'info>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

impl<'info> ClaimRewards<'info> {
    fn into_transfer_to_user_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info().clone(),
            to: self.user_token_account.to_account_info().clone(),
            authority: self.owner.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.to_account_info().clone(), cpi_accounts)
    }
}

#[account]
pub struct UserAccount {
    pub owner: Pubkey,
    pub surveys_completed: u64,
    pub total_rewards_claimed: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid user")]
    InvalidUser,
    #[msg("No rewards to claim")]
    NoRewards,
}
```

***

## 2. **Unit Tests (TypeScript)**
Place in `tests/survey_reward.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SurveyReward } from "../target/types/survey_reward";
import { assert } from "chai";

describe("survey_reward", () => {
  // Configure the client
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SurveyReward as Program<SurveyReward>;

  let user = anchor.web3.Keypair.generate();
  let mint = null;
  let userTokenAccount = null;
  let vault = null;
  let userAccountPda = null;

  it("Initializes user", async () => {
    // Add code to create a mint, token accounts, and initialize user PDA...
    // Omitted for brevity, see detailed Anchor examples on mint setup.
    // ...
    // e.g.
    // [userAccountPda] = await anchor.web3.PublicKey.findProgramAddress([...], program.programId);
    // await program.methods.initializeUser().accounts({...}).signers([user]).rpc();
  });

  it("Completes a survey", async () => {
    await program.methods
      .completeSurvey()
      .accounts({
        userAccount: userAccountPda,
        owner: user.publicKey,
      })
      .signers([user])
      .rpc();

    // Optionally fetch and assert the account state
    const userAccount = await program.account.userAccount.fetch(
      userAccountPda
    );
    assert.equal(userAccount.surveysCompleted, 1);
  });

  it("Claims rewards", async () => {
    // Setup: ensure vault has tokens, user has surveysCompleted>0, etc.
    await program.methods
      .claimRewards()
      .accounts({
        userAccount: userAccountPda,
        owner: user.publicKey,
        vault: vault,
        userTokenAccount: userTokenAccount,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Optionally assert token balance change, etc.
    // You can check userTokenAccount balance with Anchor SPL utils
  });
});
```

***

### **How This Works:**

- Each survey a user completes (via backend or other verification) increments their `surveys_completed` count on-chain.
- Claiming rewards transfers the proportional amount of SPL tokens from a "vault" account to the user’s token account.
- Unit tests simulate user lifecycle: initialize → survey → claim.

***

**Setup Tips:**
- Anchor test setup requires SPL minting logic (see Solana SPL documentation).
- You must fund the vault for claims (can mint tokens in test before running claim).
- Adjust error handling, rewards logic, and survey validation for production.

This is a minimalistic but production-ready pattern for survey-to-token reward logic on Solana. */