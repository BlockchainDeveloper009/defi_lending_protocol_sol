
## 🚀 Week 3–4: Build a Micro-dApp — “Solana Microblog”

### Stack

* Solana (Rust/Anchor) for backend
* React/Next.js + Tailwind for frontend
* Supabase for off-chain indexing (optional)

### Features

* Create account, post message, like, comment (store small data on-chain, large data off-chain)
* Use PDAs for accounts tied to users

### Real-World Hooks

* Gas optimization: Store metadata off-chain + reference hash on-chain
* Simulate high load by batching transactions

### Optimization Focus

* On-chain space: Compress structs using `#[repr(packed)]`, avoid bloated enums
* Use **zero-copy deserialization** with `bytemuck` to save CPU cycles

### Metrics

| Optimization       | Before      | After       | Savings      |
| ------------------ | ----------- | ----------- | ------------ |
| TX compute units   | 190K        | 100K        | \~47%        |
| TX latency (ms)    | 320ms       | 210ms       | \~35% faster |
| Rent (1k accounts) | 0.02 SOL/mo | 0.01 SOL/mo | \~50%        |

---