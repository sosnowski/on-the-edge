import { Pool } from "pg";
import { SurveyEvent } from "shared/models/survey";

export const getAllEvents = async (db: Pool): Promise<SurveyEvent[]> => {
    const query = {
        // give the query a unique name
        // name: "fetch-all-survey-events",
        text: "SELECT * FROM events",
    };

    const res = await db.query(query);
    return res.rows.map((row) => SurveyEvent.parse(row));
};

export const saveEvent = async (db: Pool, event: SurveyEvent) => {
    const query = {
        text: "INSERT INTO events (",
    };
};
