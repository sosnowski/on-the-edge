import { getDb as getDbClient } from 'db/client';
import { SUPABASE_API_KEY, SUPABASE_URL } from '$env/static/private';

export const getDb = () => {
	return getDbClient(SUPABASE_URL, SUPABASE_API_KEY);
};
