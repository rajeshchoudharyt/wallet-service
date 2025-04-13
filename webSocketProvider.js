import { ethers } from "ethers";
import { contractABI, contractAddress } from "./contracts/contract.js";
import { env } from "./utils/env.js";

let provider = null;
let contract = null;

async function connect() {
	provider = new ethers.providers.WebSocketProvider(
		env.ALCHEMY_WEBSOCKET_URL
	);

	provider.websocket.onerror = (err) => console.log("errr", err);

	provider._websocket.on("close", async () => {
		console.log("Websocket connection closed.");
		setTimeout(async () => { await connect() }, 5000);
	});

	contract = new ethers.Contract(
		contractAddress,
		contractABI,
		provider
	);
}

await connect();

export function getContract() {
	return contract;
}

export function getProvider() {
	return provider;
}
