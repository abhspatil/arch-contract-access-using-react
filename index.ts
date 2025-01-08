import {
  Instruction,
  Message,
  MessageUtil,
  PubkeyUtil,
  RpcConnection,
} from "@saturnbtcio/arch-sdk";
import * as process from "process";
import dotenv from "dotenv";

dotenv.config();

const client = new RpcConnection(
  process.env.VITE_RPC_URL || "http://localhost:9002"
);

const PROGRAM_PUBKEY = process.env.PROGRAM_PUBKEY;
const HELLO_ACCOUNT_PUBKEY = process.env.HELLO_ACCOUNT_PUBKEY;
const WALLET_PUBKEY = process.env.WALLET_PUBKEY;

export async function checkIfProgramDeployed() {
  try {
    const pubkeyBytes = PubkeyUtil.fromHex(PROGRAM_PUBKEY!);
    const accountInfo = await client.readAccountInfo(pubkeyBytes);
    if (accountInfo) {
      console.log("Account Info: ", accountInfo);
    }
  } catch (error) {
    console.error("Error checking program:", error);
  }
}

export async function generateInstructionAndSendRaw() {
  console.log("Hello Pats :)");

  const accountPubkey = PubkeyUtil.fromHex(HELLO_ACCOUNT_PUBKEY!);

  console.log(WALLET_PUBKEY, PROGRAM_PUBKEY);

  try {
    const instruction: Instruction = {
      program_id: PubkeyUtil.fromHex(PROGRAM_PUBKEY!),
      accounts: [
        {
          pubkey: PubkeyUtil.fromHex(WALLET_PUBKEY!),
          is_signer: true,
          is_writable: false,
        },
        {
          pubkey: accountPubkey,
          is_signer: false,
          is_writable: true,
        },
      ],
      data: new Uint8Array(),
    };

    console.log("Insruction :", instruction);

    const messageObj: Message = {
      signers: [PubkeyUtil.fromHex(WALLET_PUBKEY!)],
      instructions: [instruction],
    };

    const messageBytes = MessageUtil.serialize(messageObj);

    console.log(
      "MessageUtil.hash(messageObj): ",
      Buffer.from(MessageUtil.hash(messageObj)).toString("hex")
    );

    return;
    const signature =
      "IHC0x5anO5WUH+1pINbRCdRikm656JcoRRfuNYj0fSjZBfVHNB9MNJ7YOwwsggFxqRWeSEl9L8ahrERPjFxsus0=";

    const signatureBytes = new Uint8Array(
      Buffer.from(signature, "base64").slice(-64)
    );
    console.log(`Signature bytes: ${signatureBytes}`);

    const result = await client.sendTransaction({
      version: 0,
      signatures: [signatureBytes],
      message: messageObj,
    });

    console.log("Result: ", result);
  } catch (error) {
    console.error("Error making call:", error);
  }
}

await generateInstructionAndSendRaw();

// checkIfProgramDeployed();
