import { Client } from "pg";

export type Db = Client;

export const getDb = async (connectionString: string): Promise<Db> => {
    const client = new Client({
        connectionString,
    });
    await client.connect();
    return client;
};
