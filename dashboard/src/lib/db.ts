import { getDb as getDbClient, type Db } from "db/client";
import { SUPABASE_CONNECTION_URL } from "$env/static/private";

export const getDb = (): Promise<Db> => {
	return getDbClient(SUPABASE_CONNECTION_URL);
};
