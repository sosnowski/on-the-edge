import {
    createClient,
    SupabaseClient,
    SupabaseClientOptions,
} from "@supabase/supabase-js";

export type Db = SupabaseClient;

export const getDb = (url: string, apiKey: string): Db => {
    return createClient(url, apiKey);
};
