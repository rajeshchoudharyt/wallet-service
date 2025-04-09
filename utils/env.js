export const env = {
	ALCHEMY_WEBSOCKET_URL:
		"wss://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
	SUPABASE_URL: process.env.SUPABASE_URL,
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	FASTIFY_BACKEND_URL: process.env.FASTIFY_BACKEND_URL,
};
