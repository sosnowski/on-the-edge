import { Pool } from "pg";

let pool: Pool;

const connectionString =
    "postgresql://user:pass@microsurvey-dev-6635.7tc.cockroachlabs.cloud:26257/microsurvey?sslmode=verify-full";

export const getPool = (): Pool => {
    if (!pool) {
        pool = new Pool({
            connectionString: connectionString,
            max: 1,
            database: "microsurvey",
        });
    }
    return pool;
};
