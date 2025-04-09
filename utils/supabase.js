import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";
import { ethers } from "ethers";

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

//
async function fetchLedgerRow(wallet_address) {
	const { data, error } = await supabase
		.from("Ledger")
		.select()
		.eq("wallet_address", wallet_address);

	if (error) console.log("Error while fetching:", error);

	return data;
}

//
async function updateBalanceAndSaveToDb(eventData, rowData, amount) {
	const eventType = eventData.events[0].type;
	if (!(eventType === "Deposit" || eventType === "Withdrawal")) return;

	const prev_bal = ethers.utils.parseEther(
		rowData[0].latest_balance.toFixed(18)
	);
	const updatedBalance = ethers.utils.formatEther(
		eventType === "Deposit" ? prev_bal.add(amount) : prev_bal.sub(amount)
	);
	const updatedEvents = [eventData.events[0], ...rowData[0].events];

	const { data: insertedData, error: insertError } = await supabase
		.from("Ledger")
		.update({ latest_balance: updatedBalance, events: updatedEvents })
		.eq("wallet_address", eventData.wallet_address);

	// console.log("inserted data", insertedData);
	if (insertError) console.log("Error while inserting: Case 2:", insertError);
}

//
// Deposit event listener handler
export async function handleDepositEvent(eventData, depositAmount) {
	//
	// To check whether any event on this wallet address exist or not
	// To fetch the ledger row using wallet_address
	const rowData = await fetchLedgerRow(eventData.wallet_address);

	//
	// Case 1: First wallet transaction - No event transaction exist
	if (rowData.length === 0) {
		const { data: insertedData, error: insertError } = await supabase
			.from("Ledger")
			.insert(eventData)
			.select();

		// console.log("inserted data", insertedData);
		if (insertError)
			console.log("Error while inserting: Case 1:", insertError);
	}
	//
	//  Case 2: Atleast 1 event exist on wallet address
	else {
		await updateBalanceAndSaveToDb(eventData, rowData, depositAmount);
	}
}

//
// Withdrawal event listener handler
export async function handleWithdrawalEvent(eventData, withdrawAmount) {
	// To fetch the ledger row using wallet_address
	const rowData = await fetchLedgerRow(eventData.wallet_address);

	if (rowData.length === 0) {
		console.log(
			"Error: It looks like Database error: Inconsistent data in database."
		);
		return;
	}

	await updateBalanceAndSaveToDb(eventData, rowData, withdrawAmount);
}
