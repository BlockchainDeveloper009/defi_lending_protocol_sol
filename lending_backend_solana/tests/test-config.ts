// test-config.ts
import * as anchor from "@coral-xyz/anchor";
import * as dotenv from "dotenv";
dotenv.config();

const NETWORK_ENV = process.env.NETWORK_ENV || "localnet";
const isDevnet = NETWORK_ENV === "devnet";

const provider = anchor.AnchorProvider.env();

let programId: anchor.web3.PublicKey;
let priceFeedPubkey: anchor.web3.PublicKey;
let idl: any = null; // placeholder if you want to load a real IDL

if (isDevnet) {
  // Real Pyth program + feed (example — update to real ones)
  programId = new anchor.web3.PublicKey("FsSmjoGP..."); // Pyth devnet program
  priceFeedPubkey = new anchor.web3.PublicKey("AnExamplePythPriceFeedPubkey");
} else {
  // Use your local Anchor workspace program + generate test account
  const localProgram = anchor.workspace.MockPythOracle;
  programId = localProgram.programId;
  priceFeedPubkey = anchor.web3.Keypair.generate().publicKey;
  idl = localProgram.idl;
}

export const config = {
  NETWORK_ENV,
  isDevnet,
  provider,
  programId,
  priceFeedPubkey,
  idl,
};
