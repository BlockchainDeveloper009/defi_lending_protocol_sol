import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LendingBackendSolana } from "../target/types/lending_backend_solana";
import { assert } from "chai";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, 
mintTo, getAccount } from "@solana/spl-token";
// import { createMint, getOrCreateAssociatedTokenAccount,  createAccount, 
//   mintTo, getAccount } from "spl-token-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { startAnchor, BanksClient, ProgramTestContext } from "solana-bankrun";

import IDL from "../target/idl/lending_backend_solana.json";

import { BankrunContextWrapper } from "../bankrun-utils/bankrunConnection";

import { expect } from "chai";

import { toWeb3Connection } from "solana-bankrun";


describe("lending_backend_solana borrow", async () => {
  // Use Bankrun as the provider
  //const provider = BankrunProvider.default();
    let signer: Keypair;
    let usdcBankAccount: PublicKey;
    let solBankAccount: PublicKey;
  
    let solTokenAccount: PublicKey;
    let provider: BankrunProvider;
    let program: Program<LendingBackendSolana>;
    let banksClient: BanksClient;
    let context: ProgramTestContext;
    let bankrunContextWrapper: BankrunContextWrapper;

    context = await startAnchor(
      "", // path to anchor.toml (can be empty string if not used)
      [
        { name: "lending_backend_solana", programId: new PublicKey(IDL.address) }
      ], // your program(s) and their IDs
     
    []  //preloadAccounts // optional, for preloading accounts like Pyth price feeds
    );
const realConnection = toWeb3Connection(context);

  // context = await startAnchor(
  //   "",
  //   [{ name: "lending", programId: new PublicKey(IDL.address) }],
  //   [
  //     {
  //       address: pyth,
  //       info: accountInfo,
  //     },
  //   ]
  // );
  provider = new BankrunProvider(context);

  anchor.setProvider(provider);

  //const program = workspace.LendingBackendSolana as Program<LendingBackendSolana>;
program = new Program<LendingBackendSolana>(IDL as LendingBackendSolana, provider);
  let user = Keypair.generate();
  let bank: PublicKey;
  let userAccount: PublicKey;
  let bankTokenAccount: PublicKey;
  let userTokenAccount: PublicKey;
  let feeConfig: PublicKey;
  let feeReceiverTokenAccount: PublicKey;
  let mint: PublicKey;

  before(async () => {
    // Airdrop SOL to user
    //await provider.connection.requestAirdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL * 10);

  // ✅ Correct way to airdrop in Bankrun
//  await context.banksClient.airdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL * 10);
 //await context.banksClient.airdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL * 10);

    // Create a mint for the test token (e.g., USDC)
    // mint = await createMint(
    //   provider.connection,
    //   user, // payer
    //   user.publicKey, // mint authority
    //   null, // freeze authority
    //   6 // decimals
    // );
 
    mint = await createMint(realConnection, user, user.publicKey, null, 6);

    // Create associated token accounts
    userTokenAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      user.publicKey
    )).address;

    // Mint tokens to user
    await mintTo(
      provider.connection,
      user,
      mint,
      userTokenAccount,
      user,
      1_000_000_000 // 1000 tokens (with 6 decimals)
    );

    // Create bank and bank token account (mock PDA for test)
    bank = anchor.web3.Keypair.generate().publicKey;
    bankTokenAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      bank,
      true // allow owner off curve (for PDA)
    )).address;

    // Create fee config account (mock)
    feeConfig = anchor.web3.Keypair.generate().publicKey;
    // Create fee receiver token account
    feeReceiverTokenAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      user.publicKey
    )).address;

    // Create user account (mock)
    userAccount = anchor.web3.Keypair.generate().publicKey;

    // You may need to call your program's init instructions here to properly initialize on-chain state.
    // For example:
    // await program.methods.initBank(...).accounts({...}).rpc();
    // await program.methods.initUser(...).accounts({...}).rpc();
    // await program.methods.deposit(...).accounts({...}).rpc();
  });

  it("should allow borrowing within collateral limits and collect fees", async () => {
    // Call borrow
    const borrowAmount = new anchor.BN(100_000); // 0.1 token (with 6 decimals)
    await program.methods
      .borrow(borrowAmount)
      .accounts({
        signer: user.publicKey,
        mint,
        bank,
        bankTokenAccount,
        userAccount,
        userTokenAccount,
        feeConfig,
        feeReceiverTokenAccount,
        // Add other required accounts here (price_update, token_program, etc.)
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Fetch accounts and assert balances/fees
    const userAcc = await getAccount(provider.connection, userTokenAccount);
    const feeAcc = await getAccount(provider.connection, feeReceiverTokenAccount);

    // Example assertions (replace with your actual logic)
    assert.isAtLeast(Number(userAcc.amount), 100_000, "User should receive borrowed tokens");
    assert.isAtLeast(Number(feeAcc.amount), 1, "Fee receiver should get fee");
  });

  it("should fail if borrowing over limit", async () => {
    try {
      await program.methods
        .borrow(new anchor.BN(10_000_000_000)) // Large amount
        .accounts({
          signer: user.publicKey,
          mint,
          bank,
          bankTokenAccount,
          userAccount,
          userTokenAccount,
          feeConfig,
          feeReceiverTokenAccount,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
      assert.fail("Borrow should have failed due to over limit");
    } catch (err) {
      assert.include(err.toString(), "OverBorrowableAmount");
    }
  });

  it("should apply the correct fee", async () => {
    // Borrow a known amount, check feeReceiverTokenAccount balance before and after
    const before = await getAccount(provider.connection, feeReceiverTokenAccount);

    await program.methods
      .borrow(new anchor.BN(50_000))
      .accounts({
        signer: user.publicKey,
        mint,
        bank,
        bankTokenAccount,
        userAccount,
        userTokenAccount,
        feeConfig,
        feeReceiverTokenAccount,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const after = await getAccount(provider.connection, feeReceiverTokenAccount);
    assert.isAbove(Number(after.amount), Number(before.amount), "Fee receiver should get more tokens after borrow");
  });
});