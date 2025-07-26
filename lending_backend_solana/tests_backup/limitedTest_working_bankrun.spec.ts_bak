import { describe, it } from "node:test";
import { BN, Program } from "@coral-xyz/anchor";
import { BankrunProvider } from "anchor-bankrun";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createAccount, createMint, mintTo } from "spl-token-bankrun";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";

import { startAnchor, BanksClient, ProgramTestContext } from "solana-bankrun";

import { PublicKey, Keypair, Connection } from "@solana/web3.js";

// @ts-ignore
import IDL from "../target/idl/lending_backend_solana.json";
import { LendingBackendSolana } from "../target/types/lending_backend_solana";
import { BankrunContextWrapper } from "../bankrun-utils/bankrunConnection";

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

  const pyth = new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
  const devnet = "https://api.devnet.solana.com";
  const localnet = "http://127.0.0.1:8899";
  const devnetConnection = new Connection(localnet);
  const accountInfo = await devnetConnection.getAccountInfo(pyth);

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

  const pythSolanaReceiver = new PythSolanaReceiver({
    connection,
    wallet: provider.wallet,
  });

  const SOL_PRICE_FEED_ID =
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a";

  const solUsdPriceFeedAccount = pythSolanaReceiver
    .getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID)
    .toBase58();

  const solUsdPriceFeedAccountPubkey = new PublicKey(solUsdPriceFeedAccount);
  const feedAccountInfo = await devnetConnection.getAccountInfo(
    solUsdPriceFeedAccountPubkey
  );

  if (feedAccountInfo) {
    context.setAccount(solUsdPriceFeedAccountPubkey, feedAccountInfo);
  } else {
    console.error("Feed account info is null. Cannot set account.");
  }

  console.log("pricefeed:", solUsdPriceFeedAccount);

  console.log("Pyth Account Info:", accountInfo);

  program = new Program<LendingBackendSolana>(IDL as LendingBackendSolana, provider);

  banksClient = context.banksClient;

  signer = provider.wallet.payer;

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

 


  it("Create and Fund Token Account", async () => {
    console.log("starting----USDC Token Account Created:");
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


});