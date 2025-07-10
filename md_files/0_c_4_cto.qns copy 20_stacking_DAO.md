# 🧱 GitHub-Ready Templates: Solana Developer Projects

This document provides starter layouts for **three complete Solana developer projects**:
- Token-Staking DAO with Governance
- Crowdsourced Bounty Platform with Escrow and Multisig
- 🧪 Mock Coding Challenge: Decentralized Reputation Escrow

---

## 📁 Project 1: Token-Staking DAO with Governance

[...unchanged content from above...]

---

## 📁 Project 3: Mock Coding Challenge – Decentralized Reputation Escrow

**📜 Scenario:** Build a trustless task escrow system where users create tasks, accept them, and get reputation if completed.

**Folder Structure:**
```bash
reputation_escrow/
├── Anchor.toml
├── programs/
│   └── reputation_escrow/
│       ├── Cargo.toml
│       └── src/lib.rs
├── tests/
│   └── reputation_escrow.ts
```

### 🔨 Program Entrypoints (lib.rs)
```rust
use anchor_lang::prelude::*;

declare_id!("REPUTATION111111111111111111111111111111111");

#[program]
pub mod reputation_escrow {
    use super::*;

    pub fn create_task(ctx: Context<CreateTask>, task_id: String, description: [u8; 32], amount: u64, deadline: i64) -> Result<()> {
        let task = &mut ctx.accounts.task_account;
        task.creator = *ctx.accounts.creator.key;
        task.description = description;
        task.amount = amount;
        task.deadline = deadline;
        task.status = 0;

        // Transfer lamports to vault PDA
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.creator.key(),
            &ctx.accounts.vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;

        Ok(())
    }

    // TODO: accept_task, finalize_task, mark_expired
}

#[account]
pub struct TaskAccount {
    pub creator: Pubkey,
    pub description: [u8; 32],
    pub amount: u64,
    pub deadline: i64,
    pub status: u8,
    pub accepted_by: Option<Pubkey>,
}

#[account]
pub struct ReputationAccount {
    pub user: Pubkey,
    pub completed: u64,
}

#[derive(Accounts)]
pub struct CreateTask<'info> {
    #[account(init, payer = creator, space = 8 + 128, seeds = [b"task", task_id.as_bytes(), creator.key().as_ref()], bump)]
    pub task_account: Account<'info, TaskAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    /// CHECK: Will be validated in invoke
    #[account(mut, seeds = [b"vault", task_id.as_bytes(), creator.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

---

### 🧪 Test Scaffold (reputation_escrow.ts)
```ts
import * as anchor from "@project-serum/anchor";
const { SystemProgram } = anchor.web3;

describe("reputation_escrow", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.ReputationEscrow;

  it("Creates a task and locks lamports", async () => {
    const taskId = "task123";
    const [taskPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("task"), Buffer.from(taskId), provider.wallet.publicKey.toBuffer()],
      program.programId
    );
    const [vaultPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("vault"), Buffer.from(taskId), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods.createTask(taskId, Array(32).fill(1), new anchor.BN(10000000), new anchor.BN(Date.now() / 1000 + 3600))
      .accounts({
        taskAccount: taskPda,
        vault: vaultPda,
        creator: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const task = await program.account.taskAccount.fetch(taskPda);
    console.log("Task created:", task);
  });
});
```

---

### 📘 README.md
```markdown
# Reputation Escrow (Mock Interview Challenge)

A trustless task escrow system with on-chain reputation tracking.

## Features
- Escrow vault via PDA
- Task creation and lamport locking
- Reputation increase on finalization
- Expiry auto-handling

## Run
```bash
yarn install
anchor build
anchor test
```
```

---

Would you like full implementations of `accept_task`, `finalize_task`, and `mark_expired` next?
