"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCall = makeCall;
var arch_sdk_1 = require("@saturnbtcio/arch-sdk");
var process = require("process");
var client = new arch_sdk_1.RpcConnection(process.env.VITE_RPC_URL || "http://localhost:9002");
var PROGRAM_PUBKEY = process.env.VITE_PROGRAM_PUBKEY;
function makeCall() {
    console.log("Hello World :)");
    console.log(process.env.VITE_RPC_URL);
    console.log(process.env.PROGRAM_PUBKEY);
}
