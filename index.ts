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
      // accounts: [
      //   {
      //     pubkey: PubkeyUtil.fromHex(WALLET_PUBKEY!),
      //     is_signer: false,
      //     is_writable: false,
      //   },
      //   {
      //     pubkey: accountPubkey,
      //     is_signer: false,
      //     is_writable: false,
      //   },
      // ],
      accounts: [],
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

    // return;

    const signature =
      "IFd8tvcbXPXe1thVty0+/p0/qf9ksqNPqa5hpi9yO1wmLpjlexJ+IQHyir6TJtYTV/Le4pFJT5yNxAL4crWH8Oo=";
    // const signatureBytes = new Uint8Array();
    // Buffer.from(signature, "base64")
    const signatureBytes = Buffer.from(signature, "base64").slice(-64);
    console.log(`Signature bytes: ${signatureBytes}`);

    // console.log("Raw Transaction : ", {
    //   version: 0,
    //   signatures: [],
    //   message: messageObj,
    // });

    console.log("Signature: ", signatureBytes);
    console.log("Message: ", messageObj);

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
