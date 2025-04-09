export const env = {
	// ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
	ALCHEMY_WEBSOCKET_URL:
		"wss://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
	SUPABASE_URL: process.env.SUPABASE_URL,
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
};
