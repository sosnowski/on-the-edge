import { SurveyEvent } from "shared/models/response";
import { SurveyStats, SurveyTimelineEntry } from "shared/models/stats";
import { formatDateToInput } from "shared/helpers/date";
import { Db } from "./client";

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

export const getSurveyStats = async (
    db: Db,
    surveyId: EntityId
): Promise<SurveyStats> => {
    const query = `
        SELECT
            COUNT(distinct instance_id) FILTER (WHERE type = 'displayed') AS surveys_displayed,
            COUNT(distinct instance_id) FILTER (WHERE type = 'responded') AS surveys_responded,
            COUNT(distinct instance_id) FILTER (WHERE type = 'completed') AS surveys_completed,
            COUNT(id) FILTER (WHERE type = 'responded') AS number_of_responses
        FROM events
        WHERE survey_id = $1
    `;
    const result = await db.query(query, [surveyId]);
    const row = result.rows[0];
    return SurveyStats.parse({
        numberOfResponses: +row.number_of_responses,
        surveysDisplayed: +row.surveys_displayed,
        surveysResponded: +row.surveys_responded,
        surveysCompleted: +row.surveys_completed,
    });
};

export const getSurveyTimeline = async (
    db: Db,
    surveyId: EntityId,
    range: number
): Promise<SurveyTimelineEntry[]> => {
    const query = `
    SELECT date_trunc('day', created) as day,
        COUNT(distinct instance_id) FILTER (WHERE type = 'displayed') AS surveys_displayed,
        COUNT(distinct instance_id) FILTER (WHERE type = 'responded') AS surveys_responded,
        COUNT(distinct instance_id) FILTER (WHERE type = 'completed') AS surveys_completed
    from events
    WHERE survey_id = $1 AND
    created >= NOW() - INTERVAL '${+range} days'
    GROUP BY day ORDER BY day`;

    const result = await db.query(query, [surveyId]);

    return result.rows.map((row) =>
        SurveyTimelineEntry.parse({
            day: row.day,
            surveysDisplayed: +row.surveys_displayed || 0,
            surveysResponded: +row.surveys_responded || 0,
            surveysCompleted: +row.surveys_completed || 0,
        })
    );
};
