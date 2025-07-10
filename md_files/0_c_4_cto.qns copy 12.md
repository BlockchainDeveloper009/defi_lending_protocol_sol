Would you like to continue with Batch 2 (more advanced topics like CPI, data validation, Solana transactions, etc.)?


Perfect! Here's **Batch 2** of Solana Developer Coding Interview Questions & Answers. These focus on **advanced Anchor, Cross-Program Invocation (CPI), Solana transactions, and smart contract safety**.

---

## 🔹 **Batch 2: Advanced Solana + Anchor Q\&A**

---

### **Q11. What is `anchor_lang::prelude::*` and why is it used?**

**A:**
This is a convenience import that brings in commonly used types and macros from the Anchor framework, like:

* `ProgramResult`, `Context`, `Account`, `CpiContext`
* Derive macros like `#[program]`, `#[account]`, `#[derive(Accounts)]`

It keeps your code clean and short.

---

### **Q12. How do you prevent replay attacks in Solana programs?**

**A:**
Replay attacks are rare in Solana due to the transaction signature model. Still, for safety:

* Use unique PDAs (e.g., seeded with timestamps or nonce)
* Check for already initialized accounts using `Account::try_deserialize()` and error if they exist
* Use deterministic state transitions in your program logic

---

### **Q13. How do you pass data between instructions in Solana transactions?**

**A:**
You can:

* Pass it through **shared accounts** (mutable accounts updated in one instruction, read in the next)
* Or via **instruction data** fields (encode multiple operations in one transaction)

In Anchor, use:

```ts
const tx = new Transaction()
  .add(
    program.instruction.firstStep(...),
    program.instruction.secondStep(...)
  );
```

---

### **Q14. What is the role of the `#[program]` macro?**

**A:**
It defines the entry point for your Anchor program. All instruction handlers are defined inside the `#[program]` block.

Example:

```rust
#[program]
pub mod my_app {
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ...
    }
}
```

---

### **Q15. Explain the use of `AccountInfo` in low-level Solana programming.**

**A:**
`AccountInfo` is the low-level abstraction that wraps account metadata and data:

* `key`: pubkey
* `is_signer`, `is_writable`
* `data`: raw byte array (mutable)
* `lamports`: balance

In Anchor, you typically use `Account<T>` for safety, but `AccountInfo` is still needed for:

* CPIs
* Manually deserializing data
* System-level checks

---

### **Q16. How would you do a CPI to the SPL Token program in Anchor?**

**A:**

1. Import `anchor_spl::token`
2. Create a `CpiContext` with required accounts
3. Use the wrapper function

```rust
let cpi_ctx = CpiContext::new(
    token_program.to_account_info(),
    Transfer {
        from: source.to_account_info(),
        to: dest.to_account_info(),
        authority: authority.to_account_info(),
    },
);
token::transfer(cpi_ctx, amount)?;
```

---

### **Q17. How does Anchor serialize/deserialize account data?**

**A:**
Anchor uses `Borsh` serialization by default. Each `#[account]`-based struct:

* Must implement `BorshSerialize` and `BorshDeserialize`
* Requires the first 8 bytes to be a *discriminator* (a unique type identifier)

This allows secure deserialization and type-safe access.

---

### **Q18. What are the limitations of Anchor?**

**A:**
Anchor simplifies Solana development, but has some limitations:

* Adds overhead (space, compute) compared to pure Rust programs
* Can be rigid when performing deeply custom logic (e.g., dynamic account sizes)
* Not ideal for fully composable multi-program interactions unless you understand CPIs well

However, for 90% of apps, it's the ideal tool.

---

### **Q19. How would you debug a failed Solana transaction?**

**A:**

1. Use `solana logs` to stream validator logs (if running locally)
2. Use `solana transaction <tx-signature> --output json` for devnet
3. Decode logs in Anchor test:

```ts
const tx = await program.methods.someMethod().rpc();
console.log("tx", tx);
await connection.confirmTransaction(tx, "confirmed");
```

4. Common errors to check:

   * Compute budget exceeded
   * Incorrect PDA seeds or bumps
   * Constraint violations

---

### **Q20. How do you define reusable instruction interfaces in Anchor?**

**A:**
You can:

* Modularize each instruction in its own handler (`fn`)
* Share common `#[derive(Accounts)]` structs
* Use `mod instructions {}` to keep logic modular

Example:

```rust
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    ...
}

pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    ...
}
```

---

Would you like to continue with **Batch 3**, which will cover **Security, Design Patterns (Vault, Escrow, etc.), Compute Optimization, and Real-World Scenarios**?

I can also provide **Markdown** or **PDF** export of all batches after we complete more.
