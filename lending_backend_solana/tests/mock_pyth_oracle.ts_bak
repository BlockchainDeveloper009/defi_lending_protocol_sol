import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MockPythOracle } from "../target/types/mock_pyth_oracle";

describe("mock_pyth_oracle", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MockPythOracle as Program<MockPythOracle>;
  const user = provider.wallet;

  let priceFeedKeypair: anchor.web3.Keypair;

  it("Initializes the price feed", async () => {
    priceFeedKeypair = anchor.web3.Keypair.generate();

    await program.methods
      .initialize(new anchor.BN(4300000), -5) // $43.00000 with 5 decimals
      .accounts({
        priceFeed: priceFeedKeypair.publicKey,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([priceFeedKeypair])
      .rpc();

    const account = await program.account.priceFeed.fetch(priceFeedKeypair.publicKey);
    console.log("Initial Price:", account.price.toString()); // should be 4300000
    console.log("Exponent:", account.expo);                  // should be -5
  });

  it("Updates the price feed", async () => {
    await program.methods
      .updatePrice(new anchor.BN(4500000)) // $45.00000
      .accounts({
        priceFeed: priceFeedKeypair.publicKey,
        user: user.publicKey,
      })
      .rpc();

    const updated = await program.account.priceFeed.fetch(priceFeedKeypair.publicKey);
    console.log("Updated Price:", updated.price.toString()); // should be 4500000
  });

  

  it("Updates  --2-- the price feed", async () => {
    await program.methods
      .updatePrice(new anchor.BN(5000000)) // $45.00000
      .accounts({
        priceFeed: priceFeedKeypair.publicKey,
        user: user.publicKey,
      })
      .rpc();

    const updated = await program.account.priceFeed.fetch(priceFeedKeypair.publicKey);
    console.log("Updated --2-- Price:", updated.price.toString()); // should be 4500000
  });



    it("Updates  --3-- the price feed", async () => {
    
      console.log(`--pubkey--- ${priceFeedKeypair.publicKey} -----`)
    const updated = await program.account.priceFeed.fetch(priceFeedKeypair.publicKey);
    console.log("Updated --3-- Price:", updated.price.toString()); // should be 4500000
  });

});
