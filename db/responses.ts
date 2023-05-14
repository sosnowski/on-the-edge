import { SurveyResponse } from "shared/models/response";
import { Db } from "./client";
import { toDbRecord } from "./helper";

// export const getAllResponses = async (db: Db): Promise<SurveyEvent[]> => {
//     console.log("Executing SELECT * query");
//     const res = await db.execute("SELECT * FROM responses");
//     return res.rows.map((row) => SurveyEvent.parse(row));
// };

export const saveResponses = async (
    db: Db,
    responses: SurveyResponse[]
): Promise<void> => {
    console.log("Saving responses", responses);

    const res = await db
        .from("responses")
        .insert(responses.map((res) => toDbRecord(res)));

    console.log(res);

    const { error } = res;

    if (error) {
        console.error(error);
        throw new Error("Error saving responses");
    }
};
