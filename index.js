"use strict";

import Fastify from "fastify";
import { contract, provider } from "./webSocketProvider.js";
import { ethers } from "ethers";
import { handleDepositEvent, handleWithdrawalEvent } from "./utils/supabase.js";

const fastify = Fastify({ logger: true });

fastify.addHook("onClose", (instance) => {
	provider.websocket.close();
});

//
// Contract event listeners
contract.on("Deposit", async (from, amount, args) => {
	console.log("deposit event");

	const block = await args.getBlock();
	const timestamp = new Date(block.timestamp * 1000).toISOString();

	let eventData = {
		wallet_address: from,
		latest_balance: ethers.utils.formatEther(amount),
		events: [
			{
				type: args.event,
				amount: ethers.utils.formatEther(amount),
				txHash: args.transactionHash,
				timestamp,
			},
		],
	};

	await handleDepositEvent(eventData, amount);
});

contract.on("Withdrawal", async (to, amount, args) => {
	console.log("withdraw event");

	const block = await args.getBlock();
	const timestamp = new Date(block.timestamp * 1000).toISOString();

	let eventData = {
		wallet_address: to,
		latest_balance: ethers.utils.formatEther(amount),
		events: [
			{
				type: args.event,
				amount: ethers.utils.formatEther(amount),
				txHash: args.transactionHash,
				timestamp,
			},
		],
	};

	await handleWithdrawalEvent(eventData, amount);
});

//
//

fastify.get("/", async (req, res) => {
	res.send({ hello: "world" });
});

fastify.listen({ port: 3001 }, (err, address) => {
	if (err) {
		fastify.log(err);
		process.exit(1);
	}

	// Logging websocket state
	setInterval(() => {
		console.log("Websocket state: ", provider.websocket.readyState);
	}, 5000);
});
