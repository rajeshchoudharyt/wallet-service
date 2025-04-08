"use strict";

import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", (req, res) => {
	res.send({ hello: "world" });
});

fastify.listen({ port: 3001 }, (err, address) => {
	if (err) {
		fastify.log(err);
		process.exit(1);
	}
	console.log();
});

export default function () {}
