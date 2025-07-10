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
- `initialize_stake_account` ✅
- `stake` ✅
- `unstake` ✅
- `claim_rewards` ✅
- `create_proposal` ✅
- `vote_on_proposal` ✅
- `finalize_proposal` ✅

**Accounts:**
- `StakeAccount` – tracks user's stake, timestamp
- `VaultAccount` – PDA that holds staked tokens
- `ProposalAccount` – DAO proposals and vote tracking
- `VoteReceipt` – prevents double-voting

**Bonus:**
- Integrate `Clock` sysvar
- Use Pyth feed to vary reward rate

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
- `post_bounty` ✅
- `submit_solution` ✅
- `create_multisig_proposal` ✅
- `approve_proposal` ✅
- `execute_payout` ✅

**Accounts:**
- `BountyPost` – metadata and funds for a task
- `SubmissionAccount` – contributor’s entry
- `Vault` – escrow PDA
- `MultisigProposal` – stores proposal & signer approvals
- `ContributorReputation` – optional extension

**Bonus:**
- Use Arweave/IPFS for off-chain links
- Use PDA signer for `invoke_signed` on `token::transfer`

---

## 🧪 Testing
- Write tests using `@project-serum/anchor`
- Validate stake, vote, proposal lifecycle, and payouts
- Include edge cases: duplicate vote, unauthorized claim, deadline expired

---

## 🔧 Deployment Commands
```bash
anchor build
anchor deploy
anchor test
```

To run a localnet:
```bash
solana-test-validator --reset
```

---

## ✅ What’s Next?
- Add README and demo video
- Host frontend with wallet integration
- Link your GitHub in your resume/interview

Would you like me to generate the `lib.rs` and `#[derive(Accounts)]` code stubs next?
