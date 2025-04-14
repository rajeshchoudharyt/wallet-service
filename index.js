"use strict";

import Fastify from "fastify";

import { ethers } from "ethers";
import { env } from "./utils/env.js";
import { LedgerSchema } from "./utils/schema.js";
import { getContract, getProvider } from "./webSocketProvider.js";
import {
	fetchLedgerRows,
	handleDepositEvent,
	handleWithdrawalEvent,
} from "./utils/supabase.js";

const fastify = Fastify({ logger: true });

const contract = getContract();
const provider = getProvider();

fastify.addHook("onClose", () => {
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

//
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
// Route handlers

fastify.get("/", async (req, res) => {
	res.send({ hello: "world" });
});

//
// To return database table "Ledger"
fastify.get("/api/ledger", async (req, res) => {
	const response = await fetchLedgerRows();

	// Database error
	if (response.error) {
		res.send(response.error.message).statusCode(response.error.code);
	}

	try {
		LedgerSchema.parse(response.data);
	} catch (schemaError) {
		res.send(schemaError.errors).statusCode(400); // Schema Validation error
	}

	const parsedData = response.data.map((obj) => {
		obj.latest_balance = obj.latest_balance.toFixed(18).toString();
		return obj;
	});

	res.send(parsedData);
});

//
// Cron job - To keep app spinning (Inactivity timeout - 15 min)
// Only applicable to render cloud deployment service
try {
	setInterval(() => {
		fetch(env.FASTIFY_BACKEND_URL);
	}, 14 * 60 * 1000);
} catch (err) {}

//
fastify.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		fastify.log(err);
		process.exit(1);
	}
});
