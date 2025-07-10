Here is your **Quizlet-style Solana Developer Review Notes in Markdown format**:

---

### 📘 **Solana Developer Flashcards – Quizlet Style (Markdown)**

```markdown
# Solana Developer Flashcards

## 🔹 Batch 1: Fundamentals & Anchor Basics

- **Q:** What is the difference between an account and a program in Solana?  
  **A:** Accounts store state. Programs are executable logic. Programs modify account state.

- **Q:** What is a Program Derived Address (PDA)?  
  **A:** A deterministic, non-signable address derived from seeds + program ID, used to store data securely controlled by the program.

- **Q:** How is data stored in a Solana account?  
  **A:** In a fixed-length byte array; controlled by the owning program. Must allocate space on initialization.

- **Q:** What does `#[derive(Accounts)]` do in Anchor?  
  **A:** Auto-generates account validation logic: ownership, seeds, mutability, signer checks.

- **Q:** How do you perform a Cross-Program Invocation (CPI) in Anchor?  
  **A:** Use `CpiContext` with proper accounts and call a wrapper like `token::transfer()`.

- **Q:** Explain how rent exemption works.  
  **A:** An account must hold enough lamports to avoid being garbage collected by the runtime.

- **Q:** How do you define and throw custom errors in Anchor?  
  **A:** Use `#[error_code]` and `require!()` with custom enums.

- **Q:** What happens if a transaction exceeds the compute limit?  
  **A:** It fails with a `ComputeBudgetExceeded` error.

- **Q:** How do you test Solana programs locally?  
  **A:** Use `anchor test` with a local validator and write tests in TypeScript.

- **Q:** What is the purpose of the `bump`?  
  **A:** To recreate the same PDA; ensures the derived address is valid and secure.

## ⚙️ Batch 2: Advanced Anchor, CPIs, Validation

- **Q:** What is `anchor_lang::prelude::*` used for?  
  **A:** Brings commonly used Anchor macros and types into scope.

- **Q:** How do you prevent replay attacks?  
  **A:** Use PDAs with unique seeds (e.g., timestamps); enforce one-time actions.

- **Q:** How is data passed between Solana instructions?  
  **A:** Via shared accounts or through instruction data.

- **Q:** What does `#[program]` define?  
  **A:** The entrypoint and handlers for the Anchor smart contract.

- **Q:** What is `AccountInfo`?  
  **A:** A low-level wrapper over Solana accounts used for raw access or CPIs.

- **Q:** How do you do a CPI to the SPL Token program?  
  **A:** Use `anchor_spl::token`, pass required accounts, call wrapper function.

- **Q:** How does Anchor serialize/deserialize data?  
  **A:** Uses Borsh with an 8-byte discriminator.

- **Q:** What are limitations of Anchor?  
  **A:** Overhead from macros; limited flexibility for deeply custom logic.

- **Q:** How do you debug a failed transaction?  
  **A:** Check logs via CLI or program logs in Anchor test output.

- **Q:** How do you write reusable instruction interfaces?  
  **A:** Use modular instruction handlers and shared account structs.

## 🧠 Batch 3: Security, Vaults, Multisig, Optimization

- **Q:** How would you implement an escrow?  
  **A:** Use a PDA vault, store sender/receiver data, and finalize via CPI.

- **Q:** How do you implement a multisig wallet?  
  **A:** Use a PDA storing signer keys + threshold, store proposals, track approvals.

- **Q:** What’s a vault in Solana?  
  **A:** A PDA-controlled account that holds funds securely.

- **Q:** How to optimize compute usage?  
  **A:** Avoid loops, minimize CPIs, request extra units, fail early.

- **Q:** How to prevent account hijacking?  
  **A:** Validate ownership, use seeds + bump constraints, enforce signer checks.

- **Q:** What is `anchor_spl`?  
  **A:** A crate to simplify CPIs to Solana programs like SPL Token.

- **Q:** Describe a token vault design.  
  **A:** Users deposit tokens to a PDA; program mints/burns shares as vault tokens.

- **Q:** Common smart contract vulnerabilities?  
  **A:** Missing ownership checks, improper bump usage, account size mismatch.

- **Q:** How to handle dynamic account sizes?  
  **A:** Over-allocate, use multiple PDAs, or recreate accounts.

- **Q:** How to upgrade Anchor programs?  
  **A:** Use `--upgrade-authority`, define new logic, migrate state if needed.

## 🧪 Batch 4: Transactions, Debugging, Testing

- **Q:** Key components of a transaction?  
  **A:** Signatures, message (accounts, instructions), recent blockhash.

- **Q:** How to decode a transaction?  
  **A:** Use `solana transaction <sig> --output json` or Solana Explorer.

- **Q:** Causes of constraint violations?  
  **A:** Wrong seeds, missing bump, incorrect ownership or mutability.

- **Q:** How to test in Anchor?  
  **A:** Write tests in `/tests`, use `anchor test`, simulate full flow.

- **Q:** How to mock external programs?  
  **A:** Deploy mock programs on localnet or stub out CPIs in tests.

- **Q:** Seeded logic in Anchor?  
  **A:** Use `#[account(seeds = [...], bump)]` to enforce account derivation.

- **Q:** Debugging a tricky issue?  
  **A:** Use logs, compare seed ordering, print bump mismatches.

- **Q:** Handling upgrades?  
  **A:** Use versioned structs, migration logic, test with old and new data.

- **Q:** `Account` vs `AccountInfo` vs `UncheckedAccount`?  
  **A:** Strongly typed vs raw vs minimal validation.

- **Q:** How to precompute PDAs?  
  **A:** Use `Pubkey::find_program_address()` in code or tests.

## 🏗️ Batch 5: DAO, Staking, Tokens

- **Q:** How to build staking contract?  
  **A:** Vault PDA holds tokens, Clock sysvar for rewards, Track stake metadata.

- **Q:** How to build a DAO?  
  **A:** Governance token, Proposal PDA, Vote accounts per proposal.

- **Q:** Reward calculation strategies?  
  **A:** Use timestamp difference or reward-per-token snapshot model.

- **Q:** What are ATAs?  
  **A:** Token accounts derived from `[wallet, token_program, mint]`.

- **Q:** Difference: mint, mint_to, burn, transfer?  
  **A:** Mint = create mint; mint_to = issue tokens; burn = destroy; transfer = move tokens.

- **Q:** Anchor error reporting?  
  **A:** `#[error_code]`, `#[msg()]`, `require!()`, and `msg!()` for debug.

- **Q:** Token vesting schedule design?  
  **A:** Vault + vesting metadata with cliff and release interval.

- **Q:** Program upgrade workflow?  
  **A:** Use buffer + upgrade authority; revoke authority for production.

- **Q:** Secure token auth?  
  **A:** Use PDA as authority, validate seeds + ownership.

- **Q:** Time-locked treasury?  
  **A:** Use timestamp check with Clock sysvar before fund withdrawal.

## 🚀 Batch 6: Performance, Ecosystem, Scenarios

- **Q:** How to optimize compute units?  
  **A:** Fail fast, reduce CPIs, increase compute via `ComputeBudgetProgram`.

- **Q:** How to resize an account?  
  **A:** Close/recreate, use multiple PDAs, or over-allocate.

- **Q:** Solana compute limitations?  
  **A:** 200K units/tx default; address by request or splitting logic.

- **Q:** Use of Pyth or Switchboard?  
  **A:** On-chain oracles for price feeds; pass price account, parse data.

- **Q:** Use Jupiter/Raydium in contracts?  
  **A:** Off-chain routing; program only validates token state post-swap.

- **Q:** PDA signing with `invoke_signed`?  
  **A:** For program-authored actions like vault withdrawal or CPI authority.

- **Q:** State migration between programs?  
  **A:** Export → Reinitialize with same seeds → Optional cleanup.

- **Q:** `anchor_client` vs `@project-serum/anchor`?  
  **A:** Rust vs TypeScript clients; same IDL logic.

- **Q:** Crowdsourced bounty design?  
  **A:** BountyPost + Vault + Contribution PDA + Resolver; winner can claim.

- **Q:** Debug failing tx?  
  **A:** Use `solana transaction`, `solana logs`, and `msg!()` in code.
```

---

Would you like me to export the above as a downloadable `.md` file and then generate the `.csv` file for Quizlet import?
