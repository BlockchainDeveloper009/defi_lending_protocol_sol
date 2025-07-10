Great! Here's a **realistic, scenario-style coding challenge** designed for **interview or take-home** settings. It’s structured to test **deep Anchor skills**, **security**, **CPI knowledge**, and **real-world design patterns**.

---

## 🧪 Mock Solana Coding Challenge: “Decentralized Reputation Escrow”

---

### 🔹 Scenario:

You’ve been hired to build a **trustless escrow system** that tracks the **reputation** of participants in a decentralized task marketplace. The platform has the following flow:

---

### 🔸 Functional Requirements:

1. **User A creates an escrow task**

   * Inputs: `task_id`, `description_hash`, `amount`, `deadline`
   * Transfers funds into a **Vault PDA** (escrow)

2. **User B accepts the task**

   * Locks the task as `Accepted`
   * Stores `User B`'s public key in the task account

3. **User A can finalize** (after deadline or early completion)

   * Releases funds to `User B`
   * Increments `User B`'s on-chain `ReputationAccount` (number of tasks completed)

4. **If the deadline passes and task is not finalized**, anyone can mark the task as `Expired`

---

### 🔒 Security Requirements:

* Only **User A** (creator) can finalize a task
* Only **User B** can accept an open task
* Vault is a **PDA derived from task ID + creator**
* Funds can only be released via **program logic**
* `ReputationAccount` must be initialized if not exists

---

### 📚 Program Accounts:

| Name                | Description                                 |
| ------------------- | ------------------------------------------- |
| `TaskAccount`       | PDA seeded by task ID + creator pubkey      |
| `Vault`             | PDA that holds escrowed lamports            |
| `ReputationAccount` | Tracks number of successful tasks by a user |
| `SystemProgram`     | For lamport transfers                       |

---

### 🧩 Bonus (If You Have Time):

* Prevent accepting tasks after deadline
* Add `msg!()` logging for each major state change
* Simulate full test suite using Anchor TypeScript

---

### 🧪 Evaluation Rubric

| Area                         | Weight   |
| ---------------------------- | -------- |
| PDA + Seed usage             | ✅ High   |
| Constraint validation        | ✅ High   |
| CPI and fund handling        | ✅ High   |
| Anchor syntax / organization | ✅ Medium |
| Error handling               | ✅ Medium |
| Optional: Testing            | ✅ Bonus  |

---

### 🕒 Time Estimate

* Core program logic: \~2.5–3 hours
* Test suite: \~1 hour (if included)

---

### 🛠 Suggested Entry Point (lib.rs)

```rust
pub fn create_task(ctx: Context<CreateTask>, task_id: String, description: [u8; 32], amount: u64, deadline: i64) -> Result<()>;
pub fn accept_task(ctx: Context<AcceptTask>) -> Result<()>;
pub fn finalize_task(ctx: Context<FinalizeTask>) -> Result<()>;
pub fn mark_expired(ctx: Context<MarkExpired>) -> Result<()>;
```

---

### 📦 Want a Boilerplate?

I can:

* Generate the folder/project structure
* Provide `#[derive(Accounts)]` stubs
* Write one handler (e.g., `create_task`) as a reference
* Add a starter `test.ts` file

Let me know if you'd like me to scaffold this challenge for you to implement and deploy.
