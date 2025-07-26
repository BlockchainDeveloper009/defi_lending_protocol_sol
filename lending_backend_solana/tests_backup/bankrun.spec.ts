import { describe, it } from "node:test";
import { BN, Program } from "@coral-xyz/anchor";
import { BankrunProvider } from "anchor-bankrun";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createAccount, createMint, mintTo } from "spl-token-bankrun";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";

import { startAnchor, BanksClient, ProgramTestContext , toWeb3Connection} from "solana-bankrun";

import { Connection, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";




// @ts-ignore
// import IDL from "../../../target/idl/btc_10_lending_protocol.json";
// import { LendingBackendSolana } from "../../../target/types/lending_backend_solana";
// import { BankrunContextWrapper } from "../bankrun-utils/bankrunConnection";

import IDL from "../target/idl/lending_backend_solana.json";
import { LendingBackendSolana } from "../target/types/lending_backend_solana";
import { BankrunContextWrapper } from "../bankrun-utils/bankrunConnection";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { expect } from "chai";


describe("Lending Smart Contract Tests", async () => {
  let signer: Keypair;
  let usdcBankAccount: PublicKey;
  let solBankAccount: PublicKey;

  let solTokenAccount: PublicKey;
  let provider: BankrunProvider;
  let program: Program<LendingBackendSolana>;
  let banksClient: BanksClient;
  let context: ProgramTestContext;
  let bankrunContextWrapper: BankrunContextWrapper;
let env_str = "anchornet"
console.log("--------------------------->>:1");
  let envConfig = { 
    "devnet": { "rpc_url" : "https://api.devnet.solana.com"} ,
    "localnet": { "rpc_url" : "http://127.0.0.1:8899"} 
};

let priceUpdateAccount: PublicKey;

  let pyth = new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
  const devnet = "https://api.devnet.solana.com";
  const localnet = "http://127.0.0.1:8899";
  const devnetConnection = new Connection(localnet);
  
let accountInfo ;



  if (env_str.includes("devnet")) {
  // Use a real Pyth account on devnet
  console.log("--------------------------->>:2");
  priceUpdateAccount = new PublicKey("FsSMVb9Y5Qn2ATq8bJtYwcmBHQYaWV7kR3F6tq7bGJbG");
  accountInfo = await devnetConnection.getAccountInfo(pyth);
} else {
  console.log("--------------------------->>:3");
  // Use a mock for local/bankrun
  
  const bootstrapContext = await startAnchor(  "",           // path to anchor.toml (can be empty)
  [],           // no programs yet
  []            // no preload accounts
   );
const bootstrapProvider = new BankrunProvider(bootstrapContext);
console.log('----');
console.log(bootstrapContext.lastBlockhash); // ✅ this exists
console.log('----');

const bootstrapConnection = bootstrapProvider.connection;
const bootstrapPayer = bootstrapProvider.wallet.payer;

const fundedKeypair = Keypair.generate();

await createAndFundAccount(bootstrapContext, fundedKeypair); // ← Funded with SOL

const mockPythAccount = await createMockPythPriceAccount(
  bootstrapConnection,
  fundedKeypair
);

const accountInfo = await bootstrapConnection.getAccountInfo(mockPythAccount);



priceUpdateAccount = mockPythAccount;
pyth = mockPythAccount;


  // pyth = priceUpdateAccount; // Update pyth to the mock account
  // accountInfo = await devnetConnection.getAccountInfo(pyth);
  console.log("Mock Pyth Price Account Created:", pyth.toBase58());
  console.log("Pyth Account Info:", accountInfo);
  if (!accountInfo) {
    console.error("Failed to create mock Pyth price account. Account info is null.");
  }
  console.log("Using mock Pyth price account for localnet/bankrun tests.");
  
  
}


  context = await startAnchor(
    "",
    [{ name: "lending_backend_solana", programId: new PublicKey(IDL.address) }],
    accountInfo
      ? [
          {
            address: pyth,
            info: accountInfo,
          },
        ]
      : []
  );


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

  bankrunContextWrapper = new BankrunContextWrapper(context);

  const connection = bankrunContextWrapper.connection.toConnection();
console.log(`--------------------------->>:1.1`);
  const pythSolanaReceiver = new PythSolanaReceiver({
    connection,
    wallet: provider.wallet,
  });

  const SOL_PRICE_FEED_ID =
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a";
console.log(`--------------------------->>:1.2`);
  const solUsdPriceFeedAccount = pythSolanaReceiver
    .getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID)
    .toBase58();
console.log(`--------------------------->>:1.3`);
  const solUsdPriceFeedAccountPubkey = new PublicKey(solUsdPriceFeedAccount);
  const feedAccountInfo = await devnetConnection.getAccountInfo(
    solUsdPriceFeedAccountPubkey
  );
console.log(`--------------------------->>:1.4`);
  if (feedAccountInfo) {
    context.setAccount(solUsdPriceFeedAccountPubkey, feedAccountInfo);
  } else {
    console.error("Feed account info is null. Cannot set account.");
  }
console.log(`--------------------------->>:1.5`);
  console.log("pricefeed:", solUsdPriceFeedAccount);

  console.log("Pyth Account Info:", accountInfo);

  program = new Program<LendingBackendSolana>(IDL as LendingBackendSolana, provider);

  banksClient = context.banksClient;

signer = provider.wallet.payer;
const anotherAccount = Keypair.generate();
// Airdrop SOL to the signer
// const airdropSig = await connection.requestAirdrop(signer.publicKey, 2 * LAMPORTS_PER_SOL);


// await connection.confirmTransaction(airdropSig, "confirmed");


// Fund the signer with SOL using BankrunProvider's airdrop
// await provider.connection.requestAirdrop(
//   signer.publicKey,
//   2 * LAMPORTS_PER_SOL
// );

const airdropAmount = 5 * LAMPORTS_PER_SOL; //5 SOL (in lamports)
//100_000_000_000; // 100 SOL (in lamports)

    // Get initial balance of the new account (should be 0)
    let newAccountBalance = await banksClient.getAccount(anotherAccount.publicKey);
    expect(newAccountBalance).to.be.null; // Or expect(newAccountBalance?.lamports || 0).to.equal(0);

    // Create a transfer instruction from the funded payer to the new account
    const transferIx = SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: anotherAccount.publicKey,
      lamports: airdropAmount,
    });

    const transaction = new Transaction().add(transferIx);
    transaction.recentBlockhash = context.lastBlockhash;
    transaction.sign(signer); // Payer signs the transaction

    // Send the transaction
   
    try {
      await banksClient.processTransaction(transaction); // Process the transaction in the bankrun environment
      const newAccountBalance = await banksClient.getAccount(anotherAccount.publicKey);
      
      expect(newAccountBalance?.lamports).to.equal(airdropAmount); // Check if
      console.log(`New account ${anotherAccount.publicKey.toBase58()} funded. Balance: ${newAccountBalance?.lamports / LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
      console.error("Failed to fund another account:", error);
      // Depending on your testing philosophy, you might re-throw the error here
      // or simply log it if the test can proceed without this specific funding.
    }




    


  const mintUSDC = await createMint(
    // @ts-ignore
    banksClient,
    signer,
    signer.publicKey,
    null,
    2
  );

  const mintSOL = await createMint(
    // @ts-ignore
    banksClient,
    signer,
    signer.publicKey,
    null,
    2
  );

  [usdcBankAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), mintUSDC.toBuffer()],
    program.programId
  );

  [solBankAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), mintSOL.toBuffer()],
    program.programId
  );

  [solTokenAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), mintSOL.toBuffer()],
    program.programId
  );

  console.log("USDC Bank Account", usdcBankAccount.toBase58());

  console.log("SOL Bank Account", solBankAccount.toBase58());
  it("Test Init User", async () => {
    const initUserTx = await program.methods
      .initUser(mintUSDC)
      .accounts({
        signer: signer.publicKey,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Create User Account", initUserTx);
  });

  it("Test Init and Fund USDC Bank", async () => {
    const initUSDCBankTx = await program.methods
      .initBank(new BN(1), new BN(1))
      .accounts({
        signer: signer.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Create USDC Bank Account", initUSDCBankTx);

    const amount = 10_000 * 10 ** 9;
    const mintTx = await mintTo(
      // @ts-ignores
      banksClient,
      signer,
      mintUSDC,
      usdcBankAccount,
      signer,
      amount
    );

    console.log("Mint to USDC Bank Signature:", mintTx);
  });

  it("Test Init amd Fund SOL Bank", async () => {
    const initSOLBankTx = await program.methods
      .initBank(new BN(1), new BN(1))
      .accounts({
        signer: signer.publicKey,
        mint: mintSOL,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Create SOL Bank Account", initSOLBankTx);

    const amount = 10_000 * 10 ** 9;
    const mintSOLTx = await mintTo(
      // @ts-ignores
      banksClient,
      signer,
      mintSOL,
      solBankAccount,
      signer,
      amount
    );

    console.log("Mint to SOL Bank Signature:", mintSOLTx);
  });

  it("Create and Fund Token Account", async () => {
    const USDCTokenAccount = await createAccount(
      // @ts-ignores
      banksClient,
      signer,
      mintUSDC,
      signer.publicKey
    );

    console.log("USDC Token Account Created:", USDCTokenAccount);

    const amount = 10_000 * 10 ** 9;
    const mintUSDCTx = await mintTo(
      // @ts-ignores
      banksClient,
      signer,
      mintUSDC,
      USDCTokenAccount,
      signer,
      amount
    );

    console.log("Mint to USDC Bank Signature:", mintUSDCTx);
  });

  it("Test Deposit", async () => {
    const depositUSDC = await program.methods
      .deposit(new BN(100000000000))
      .accounts({
        signer: signer.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("BANKRUN_TESTS::: Deposit USDC", depositUSDC);
    await printTxLogs(connection, depositUSDC); // <-- Add this line
  });

  it("Test Borrow", async () => {
    const borrowSOL = await program.methods
      .borrow(new BN(1))
      .accounts({
        signer: signer.publicKey,
        mint: mintSOL,
        tokenProgram: TOKEN_PROGRAM_ID,
        priceUpdate: solUsdPriceFeedAccount,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Borrow SOL", borrowSOL);
    await printTxLogs(connection, borrowSOL); // <-- Add this line
  });

  it("Test Repay", async () => {
    const repaySOL = await program.methods
      .repay(new BN(1))
      .accounts({
        signer: signer.publicKey,
        mint: mintSOL,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Repay SOL", repaySOL);
    await printTxLogs(connection, repaySOL); // <-- Add this line
  });

  it("Test Withdraw", async () => {
    const withdrawUSDC = await program.methods
      .withdraw(new BN(100))
      .accounts({
        signer: signer.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Withdraw USDC", withdrawUSDC);
    await printTxLogs(connection, withdrawUSDC); // <-- Add this line
  });
});

async function printTxLogs(connection: Connection, txSig: string) {
  const tx = await connection.getParsedTransaction(txSig, { commitment: "confirmed" });
  if (tx && tx.meta && tx.meta.logMessages) {
    console.log(`\n--- Logs for ${txSig} ---`);
    tx.meta.logMessages.forEach((log) => console.log(log));
    console.log('-------------------------\n');
  } else {
    console.log(`No logs found for ${txSig}`);
  }
}

export async function createMockPythPriceAccount(
  banksClient: BanksClient,
  payer: Keypair,
  programId = new PublicKey("11111111111111111111111111111111"),
  size = 3312 // Pyth price account size
): Promise<PublicKey> {
  const mockPyth = Keypair.generate();

  const lamports = 2_000_000; // Hardcoded amount (example)
  // //await banksClient.getMinimumBalanceForRentExemption(size);

  const ix = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mockPyth.publicKey,
    lamports,
    space: size,
    programId,
  });

  const tx = new Transaction().add(ix);

  const [blockhash] = await banksClient.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer, mockPyth);

  await banksClient.processTransaction(tx);

  return mockPyth.publicKey;
}



export async function createAndFundAccount(
  context: ProgramTestContext,
  toKeypair?: Keypair,
  lamports: number = 5 * 1_000_000_000, // Default to 5 SOL,
  recentBlockhash: string
): Promise<{ account: Keypair; balance: number }> {
  const banksClient = context.banksClient;
  const fromKeypair = context.payer;
  const newAccount = toKeypair ?? Keypair.generate();

  const transferIx = SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: newAccount.publicKey,
    lamports,
  });

  const tx = new Transaction().add(transferIx);

  const [blockhash] = await banksClient.getLatestBlockhash();
  tx.recentBlockhash = blockhash;

  tx.sign(fromKeypair);

  await banksClient.processTransaction(tx);

  const newAccountInfo = await banksClient.getAccount(newAccount.publicKey);
  const actualBalance = newAccountInfo?.lamports ?? 0;

  expect(actualBalance).to.equal(lamports);

  console.log(
    `Funded account ${newAccount.publicKey.toBase58()} with ${actualBalance / 1_000_000_000} SOL`
  );

  return { account: newAccount, balance: actualBalance };
}

