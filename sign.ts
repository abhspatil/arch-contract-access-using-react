import * as bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { sign } from "crypto";
import { ECPairFactory } from "ecpair";
import * as tinysecp from "tiny-secp256k1";

const ECPair = ECPairFactory(tinysecp);

// Example private key in hex format
const hexPrivateKey =
  "081a54fac0772dbc7204acd634a830dcce38a3b2d56094c1f3b28596c9067ace"; // Replace with your hex private key

// Decode the private key from hex
const keyPair = ECPair.fromPrivateKey(Buffer.from(hexPrivateKey, "hex"));

// // Get the public address from the key pair
// const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

// console.log("Address:", address);

// The message to sign with BIP-322 prefix
const message =
  "82067b28ef316419dc3717a104b49b992555e01d335eda6549f6aece14eac5d5";
const bip322Prefix = "BIP322: "; // Prefix for BIP-322

// Create the full message with the prefix
const fullMessage = bip322Prefix + message;

// Sign the message
const signature = bitcoinMessage.sign(
  fullMessage,
  Buffer.from(keyPair.privateKey!),
  keyPair.compressed
);

console.log(signature);
// Output the signature in base64 format
console.log("Signature:", signature.toString("base64"));
