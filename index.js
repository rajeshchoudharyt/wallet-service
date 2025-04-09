"use strict";

import Fastify from "fastify";
import { contract, provider } from "./webSocketProvider.js";

const fastify = Fastify({ logger: true });

fastify.addHook("onClose", (instance) => {
	provider.websocket.close();
});

//
// Contract event listeners
contract.on("Deposit", (...args) => {
	console.log("deposit event");
	console.log(args);
});

contract.on("Withdrawal", (...args) => {
	console.log("withdraw event");
	console.log(args);
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
