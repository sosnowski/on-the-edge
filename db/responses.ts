import { SurveyResponse } from "shared/models/response";
import { Db } from "./client";
import { toDbRecord } from "./helper";
import { QueryResult } from "pg";

export const saveResponses = async (
    db: Db,
    responses: SurveyResponse[]
): Promise<void> => {
    console.log("Saving responses", responses);

    console.log("SAVING RESPONSE QUERY");
    console.log(
        `INSERT INTO responses (survey_id, instance_id, user_token, question_id, content) VALUES ${responses
            .map(
                (q, i) =>
                    `( $${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${
                        i * 6 + 4
                    }, $${i * 6 + 5})`
            )
            .join(", ")}`,
        responses.flatMap((resp) => {
            return [
                resp.surveyId,
                resp.instanceId,
                resp.userToken,
                resp.questionId,
                resp.content,
            ];
        })
    );

    await db.query(
        `INSERT INTO responses (survey_id, instance_id, user_token, question_id, content) VALUES ${responses
            .map(
                (q, i) =>
                    `( $${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${
                        i * 6 + 4
                    }, $${i * 6 + 5})`
            )
            .join(", ")}`,
        responses.flatMap((resp) => {
            return [
                resp.surveyId,
                resp.instanceId,
                resp.userToken,
                resp.questionId,
                resp.content,
            ];
        })
    );
};

export const getResponsesBySurveyId = async (
    db: Db,
    surveyId: string
): Promise<SurveyResponse[]> => {
    console.log("Getting responses for survey", surveyId);

    const res = await db.query(
        "SELECT * FROM responses WHERE survey_id = $1 ORDER BY created DESC",
        [surveyId]
    );

    console.log(res);

    return (res.rows || []).map((row) => SurveyResponse.parse(row));
};

/**
 * SELECT instance_id, json_agg(json_build_object('question_id', question_id, 'label', questions.label, 'content', content)) as response_ids FROM responses LEFT JOIN questions ON responses.question_id = questions.id GROUP BY instance_id;
 */
