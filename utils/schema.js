import { z } from "zod";

// Database schema validation
const balanceRegex = new RegExp(/^\d+(\.\d+)?$/); // Currency
const hashRegex = new RegExp(/^0x[a-zA-Z0-9]{40}$/); // Address or tx Hash

const eventsSchema = z.object({
	type: z.enum(["Deposit", "Withdrawal"]),
	amount: z.string().regex(balanceRegex),
	txHash: z.string().regex(hashRegex),
	timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid ISO Timestamp",
	}),
});

export const LedgerSchema = z.object({
	id: z.number().int(),
	created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid ISO Timestamp",
	}),
	wallet_address: z.string().regex(hashRegex),
	latest_balance: z.string().regex(balanceRegex),
	events: z.array(eventsSchema),
});
