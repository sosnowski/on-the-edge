import { Db } from "./client";
import { Survey } from "shared/models/base/survey";

export const getAllSurveysByContainer = async (
    db: Db,
    containerId: number
): Promise<Survey[]> => {
    console.log("Executing SELECT * query");
    const res = await db.execute(
        "SELECT * FROM surveys WHERE containerId = ? ORDER BY createdAt DESC",
        [containerId]
    );
    return res.rows.map((row) => Survey.parse(row));
};
