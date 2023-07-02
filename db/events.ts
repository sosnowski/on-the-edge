import { SurveyEvent } from "shared/models/response";
import { Db } from "./client";
import { fromDbRecord } from "./helper";
import { EntityId, newEntityId } from "shared/models/base";

export const saveEvents = async (
    db: Db,
    events: SurveyEvent[]
): Promise<void> => {
    console.log("Saving survey events", events);

    const query = `INSERT INTO events (survey_id, instance_id, user_token, type, question_id) VALUES ${events
        .map(
            (e, i) =>
                `( $${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${
                    i * 5 + 4
                }, $${i * 5 + 5})`
        )
        .join(", ")}`;
    //ON CONFLICT (survey_id, instance_id, type, question_id) DO NOTHING
    const queryParams = events.flatMap((e) => {
        return [
            e.surveyId,
            e.instanceId,
            e.userToken,
            e.type,
            e.type === "responded" ? e.questionId : null,
        ];
    });

    console.log(query, queryParams);
    await db.query(query, queryParams);
};
