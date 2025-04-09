import { ethers } from "ethers";
import { contractABI, contractAddress } from "./contracts/contract.js";
import { env } from "./utils/env.js";

let provider = null;

async function connect() {
	provider = new ethers.providers.WebSocketProvider(
		env.ALCHEMY_WEBSOCKET_URL
	);

	provider.websocket.onerror = (err) => console.log("errr", err);

	provider._websocket.on("close", async () => {
		console.log("Websocket connection closed.");
		await connect();
	});

	const contract = new ethers.Contract(
		contractAddress,
		contractABI,
		provider
	);

	return contract;
}

const contract = await connect();

export { contract, provider };
