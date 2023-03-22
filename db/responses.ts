import type { Connection, ExecutedQuery } from "@planetscale/database";
import { nanoid } from "nanoid";
import { ResponseEvent, SurveyEvent } from "shared/models/survey";

export const getAllResponses = async (
    db: Connection
): Promise<SurveyEvent[]> => {
    console.log("Executing SELECT * query");
    const res = await db.execute("SELECT * FROM responses");
    return res.rows.map((row) => SurveyEvent.parse(row));
};

export const saveResponses = async (
    db: Connection,
    event: ResponseEvent[]
): Promise<void> => {
    const values = event.flatMap((event) =>
        event.responses.map((response) => [
            event.userId,
            event.surveyId,
            event.sessionToken,
            response.fieldId,
            response.type,
            response.content,
        ])
    );

    const query = `INSERT INTO responses (userId, surveyId, sessionToken, fieldId, fieldType, content) VALUES ${values
        .map((_) => "(?, ?, ?, ?, ?, ?)")
        .join(", ")}`;

    console.log("Executing INSERT query");
    const res = await db.execute(query, values.flat());
    console.log("Query executed!");
    console.log(res);
};
