Great — if you're using **Anchor with Bankrun** and want to **mock the Pyth oracle**, you’re in a very good position to test end-to-end price logic locally without hitting devnet.

### ✅ Goal:

Mock a **Pyth price account** in your local test environment (Bankrun), so your Anchor program behaves *as if* it's reading real-time price data.

---

## 🔧 Step-by-Step: Mocking Pyth in Anchor + Bankrun

### 1. 📦 Add Pyth SDK dependency

Use the official Pyth client interface (optional but useful if you're deserializing real data):

```toml
# In Cargo.toml
[dependencies]
pyth-sdk-solana = "0.6"
```

But for mocking, you don’t **have** to use this — you can just create a custom mock account structure that mimics the real layout.

---

### 2. 📐 Understand the Pyth Price Account layout

You need to fake the **price account**.

On-chain, the Pyth price account is a binary blob (with a known format). The fields you're typically interested in are:

| Field  | Type | Description                  |
| ------ | ---- | ---------------------------- |
| magic  | u32  | Always 0xa1b2c3d4            |
| ver    | u32  | Version                      |
| atype  | u32  | Account type = 3 (price)     |
| price  | i64  | Current price (x 10^expo)    |
| expo   | i32  | Price exponent (e.g. -8)     |
| conf   | u64  | Confidence interval          |
| status | u32  | Trading status (1 = Trading) |

Full layout is here: [https://github.com/pyth-network/pyth-client-rs/blob/main/src/lib.rs](https://github.com/pyth-network/pyth-client-rs/blob/main/src/lib.rs)

You only need to set **a few fields** for your program to read prices properly.

---

### 3. 🛠️ Create a fake Pyth account in Bankrun

In your Anchor test (with Bankrun):

```rust
use pyth_sdk_solana::state::PriceAccount;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;
use anchor_lang::solana_program::program_pack::Pack;

#[tokio::test]
async fn test_with_mock_pyth() {
    let program = Bankrun::new(...).await;

    // Allocate 512 bytes for the price account
    let price_account_key = Pubkey::new_unique();
    let price_account_size = 512;

    // Create mock price data
    let mut data = vec![0u8; price_account_size];

    // Set up fake Pyth price values
    let price: i64 = 25_000_000_000; // $250.00 with expo -8
    let expo: i32 = -8;

    // Set the magic and account type
    data[0..4].copy_from_slice(&0xa1b2c3d4u32.to_le_bytes()); // magic
    data[4..8].copy_from_slice(&2u32.to_le_bytes()); // version
    data[8..12].copy_from_slice(&3u32.to_le_bytes()); // atype (price)

    // Set expo
    data[20..24].copy_from_slice(&(expo as u32).to_le_bytes());

    // Set price value
    data[208..216].copy_from_slice(&price.to_le_bytes()); // current price
    data[224..232].copy_from_slice(&(1u64 << 32).to_le_bytes()); // confidence

    // Set status to "Trading"
    data[232..236].copy_from_slice(&(1u32).to_le_bytes()); // status = Trading

    // Create the account
    program
        .create_account_raw(price_account_key, &data, price_account_size, &PYTH_PROGRAM_ID)
        .await
        .unwrap();

    // Now pass it as CPI account into your test instruction
}
```

Replace `PYTH_PROGRAM_ID` with whatever your program expects (often passed via `#[account(address = "...")]`).

---

### 4. 📥 In your Anchor program

Assuming you have something like:

```rust
#[account()]
pub price_feed: AccountInfo<'info>,
```

You deserialize and read the price using `pyth-sdk-solana`:

```rust
let price_data = &price_feed.try_borrow_data()?;
let price_account = pyth_sdk_solana::state::load_price_account(price_data)?;

let price = price_account.agg.price as f64 * 10f64.powi(price_account.expo);
```

This will work with your mock because the fields are in the right places.

---

### 🧪 Bankrun Integration

Since Bankrun lets you run **full test scripts with mocked accounts**, this setup lets you simulate:

* Different price values,
* Changing confidence intervals,
* "Halted" markets by changing the `status` flag.

You can update the `data` and overwrite the account anytime during the test.

---

## ✅ Summary

You can mock a Pyth price feed in Bankrun by:

* Creating a raw Solana account with the correct Pyth binary layout,
* Writing fake values for `price`, `expo`, and `status`,
* Using `pyth_sdk_solana::state::load_price_account()` to deserialize on-chain or off-chain,
* Controlling price behavior dynamically in tests.

---

Would you like:

* A ready-to-use helper function like `create_mock_pyth_price_account()`?
* A working test with your Anchor instruction (e.g., `deposit` that reads price)?
* Help mocking multiple feeds (e.g., `SOL/USD`, `USDC/USD`)?

Let me know and I’ll provide code!
