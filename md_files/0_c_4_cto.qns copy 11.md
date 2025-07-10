Great! Let's start with **Batch 1 of Solana Developer Coding Interview Questions & Answers**. These cover foundational Solana + Anchor concepts, and are designed to help you build confidence in interviews.

---

## 🔹 **Batch 1: Core Solana + Anchor Q\&A**

---

### **Q1. What is the difference between an account and a program in Solana?**

**A:**
In Solana:

* **Accounts** store state (data), and every interaction involves accounts.
* **Programs** are executable code (e.g., smart contracts) deployed to the chain.
  They **do not hold state** directly; instead, they **modify state stored in accounts**.

---

### **Q2. What is a Program Derived Address (PDA) and why is it used?**

**A:**
PDAs are **deterministic, non-signable** addresses generated using:

```rust
Pubkey::find_program_address(seeds, program_id)
```

They’re often used as:

* Vaults or escrow accounts owned by a program
* Metadata or state accounts with predictable addresses

Since they can’t be signed using a private key, **only the owning program can modify them** (secure access control).

---

### **Q3. How is data stored in a Solana account?**

**A:**
Each account contains:

* `lamports`: balance in SOL
* `owner`: program authorized to change its data
* `data`: raw byte array (can be deserialized via Borsh)
* `rent_epoch`: for rent exemption checks

You must explicitly allocate space using `#[account(init, space = X)]`.

---

### **Q4. What does `#[derive(Accounts)]` do in Anchor?**

**A:**
It auto-generates boilerplate to:

* Deserialize account data
* Validate account relationships (ownership, seeds, mutability, signer status)
* Initialize or assert constraints (`#[account(init, payer, seeds, bump)]`)

This makes programs more readable, secure, and developer-friendly.

---

### **Q5. How do you perform a Cross-Program Invocation (CPI) in Anchor?**

**A:**
You need to:

1. Define a CPI context using `CpiContext`
2. Import the target program's instruction logic
3. Call the program using Anchor’s `invoke()` wrapper

Example:

```rust
let cpi_ctx = CpiContext::new(token_program.to_account_info(), Transfer {
    from: from_account.to_account_info(),
    to: to_account.to_account_info(),
    authority: authority.to_account_info(),
});
token::transfer(cpi_ctx, amount)?;
```

---

### **Q6. Explain how rent exemption works.**

**A:**

* Solana requires accounts to have a minimum lamport balance to stay alive.
* If below rent threshold, the account may be garbage collected.
* Anchor ensures rent exemption by calculating space and funding it from the payer:

```rust
#[account(init, payer = user, space = 8 + MyStruct::LEN)]
```

---

### **Q7. How do you define and throw custom errors in Anchor?**

**A:**
Define with the `#[error_code]` macro:

```rust
#[error_code]
pub enum MyError {
    #[msg("Unauthorized access.")]
    Unauthorized,
}
```

Then use:

```rust
return Err(MyError::Unauthorized.into());
```

---

### **Q8. What happens when a transaction exceeds the compute limit?**

**A:**
Solana enforces a compute budget per transaction (default \~200k units).
If the program exceeds it, the transaction fails with:

```
Error: Compute Budget Exceeded
```

To prevent this:

* Optimize logic (early return, fewer loops)
* Use CPI wisely
* Request more units via `ComputeBudget` program (advanced)

---

### **Q9. How do you test Solana programs locally?**

**A:**

* Run a **local validator**: `solana-test-validator`
* Use **Anchor tests** in `tests/` folder (written in TypeScript)
* Deploy to localnet using `anchor deploy --provider.cluster localnet`

Use `anchor test` to:

* Spin up a local validator
* Build and deploy the program
* Run integration tests with fixture accounts

---

### **Q10. What is the purpose of the `bump` in Anchor?**

**A:**
When deriving a PDA, you use:

```rust
let (pda, bump) = Pubkey::find_program_address(&[seeds], program_id);
```

Anchor needs the `bump` to regenerate the same address deterministically.
Use:

```rust
#[account(
  seeds = [b"vault", user.key().as_ref()],
  bump,
)]
pub vault: Account<'info, VaultAccount>
```

---

Would you like to continue with **Batch 2 (more advanced topics like CPI, data validation, Solana transactions, etc.)**?

I can also export this in Markdown or PDF when you're done reviewing.
