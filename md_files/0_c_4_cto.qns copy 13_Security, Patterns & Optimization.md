Batch 3, which will cover Security, Design Patterns (Vault, Escrow, etc.), Compute Optimization, and Real-World Scenarios?

Great! Here's **Batch 3** of Solana Developer Coding Interview Questions & Answers. This round focuses on **Security, Design Patterns (Vault, Escrow, Multisig), Compute Optimization, and Real-World Scenarios**.

---

## 🔹 **Batch 3: Security, Patterns & Optimization**

---

### **Q21. How would you implement an escrow contract in Anchor?**

**A:**
Key steps:

1. **Initializer** creates an escrow account and transfers tokens to a PDA (vault).
2. **Taker** accepts the trade and deposits the counter tokens.
3. Upon acceptance, tokens are swapped and escrow is closed.

Use:

* Two `TokenAccount`s
* A `Vault` PDA owned by the program
* Cross-Program Invocation (CPI) to `token::transfer`

---

### **Q22. How do you implement a multisig wallet in Solana?**

**A:**
Basic flow:

* Define a multisig account with:

  * List of signer public keys
  * Threshold
  * List of pending transactions
* Users submit proposals → others approve → once enough approvals, it executes via CPI

Anchor will help with:

* State validation
* Signer enforcement
* PDA-based authority over vaults

---

### **Q23. What’s a vault in Solana, and how would you use it securely?**

**A:**
A **vault** is a PDA account that holds tokens or SOL securely, controlled only by the program.

Use cases:

* Escrow systems
* Lending pools
* Treasury storage

Ensure:

* It’s a **PDA** (cannot be externally signed)
* Only your program has logic to transfer from it
* Seeds and `bump` are hardcoded to avoid collision

---

### **Q24. How do you optimize compute usage in Solana programs?**

**A:**

* Avoid unnecessary serialization or loops
* Keep account lists short
* Use early returns (`require!()` before processing heavy logic)
* Avoid redundant CPIs
* Use **`ComputeBudget`** to request more units when needed:

```rust
let ix = ComputeBudgetInstruction::request_units(400_000, 0);
```

---

### **Q25. How can you protect against account hijacking?**

**A:**

* Always validate that accounts are:

  * Owned by the correct program
  * Mutability and signer flags are appropriate
* Use `#[account(seeds = [...], bump)]` to lock down PDAs
* Use access control constraints (`has_one = authority`, `constraint = account.owner == *authority.key`)

---

### **Q26. What’s the purpose of `anchor_spl` and how is it used?**

**A:**
`anchor_spl` is a crate that wraps standard Solana programs like SPL Token, Associated Token Accounts, Token 2022.

Use like this:

```rust
use anchor_spl::token::{Token, Transfer, Mint, TokenAccount};

#[derive(Accounts)]
pub struct TransferCtx<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    ...
}
```

Makes CPIs easier with type-safe wrappers.

---

### **Q27. Describe a real-world design pattern you've used in Solana smart contracts.**

**A:**
*Example: Tokenized Vault Strategy*

* Users deposit tokens into a vault PDA
* Program mints vault tokens to represent shares
* On withdrawal, vault tokens are burned and user gets a portion of vault balance

Helps abstract ownership and pool liquidity.

---

### **Q28. What are some common Solana smart contract vulnerabilities?**

**A:**

* **Unchecked account ownership:** allows unauthorized updates
* **Improper PDA seeds:** could allow malicious reuse
* **Missing signer checks**
* **State size overflow:** updating beyond allocated data space
* **Improper error handling:** silently failing without reverting

Anchor mitigates many of these via macro constraints and deserialization safety.

---

### **Q29. How would you handle dynamic account sizes (e.g., user profiles, metadata)?**

**A:**

* Solana accounts have fixed size.
* To support dynamic data:

  * Over-allocate (with padding)
  * Use a vector with size caps
  * Or split into multiple accounts (linked by PDA seeds)

Use `space = 8 + MAX_LEN` in `#[account(init, ...)]`.

---

### **Q30. Describe how you would write a contract upgrade using Anchor.**

**A:**
If the program is **upgradable**:

1. Store the state in versioned `enum`s or structs
2. Add new logic to the handler in a backward-compatible way
3. Deploy using:

```sh
anchor build
solana program deploy --upgrade-authority path/to/upgrade-key
```

Best practice:

* Add migration logic if structure changes
* Use `Anchor.toml` and `programs/` layout properly

---

Would you like to proceed with **Batch 4**, which will focus on:

* Solana Transaction Anatomy
* Custom Accounts and Seeded Logic
* Anchor Testing and Mocks
* Live Transaction Debugging
* and Design Deep Dives?

Let me know if you'd also like a **PDF or Markdown export** once all batches are done.
