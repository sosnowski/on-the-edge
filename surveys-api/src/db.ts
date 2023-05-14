import { getDb as getDbClient } from "db/client";
import type { Env } from "./env";

export const getDb = (env: Env) => {
	return getDbClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);
};
