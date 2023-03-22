import { Config, connect, Connection } from "@planetscale/database";

export type Db = Connection;

let db: Db;
export const getDb = async (config: Config): Promise<Db> => {
    if (!db) {
        db = await connect(config);
    }
    return db;
};
