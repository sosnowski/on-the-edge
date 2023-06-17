import {
    ResponsesByInstance,
    SurveyResponse,
    type ResponsesDetailsByInstance,
    Tag,
} from "shared/models/response";
import { Db } from "./client";
import { fromDbRecord, toDbRecord } from "./helper";
import { QueryResult } from "pg";
import { EntityId, newEntityId } from "shared/models/base";
import { nanoid } from "nanoid";
import { SurveyInfo } from "shared/models/survey";

export const saveResponses = async (
    db: Db,
    responses: SurveyResponse[]
): Promise<void> => {
    console.log("Saving responses", responses);

    console.log("SAVING RESPONSE QUERY");
    console.log(
        `INSERT INTO responses (survey_id, instance_id, user_token, question_id, content, created, updated) VALUES ${responses
            .map(
                (q, i) =>
                    `( $${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${
                        i * 7 + 4
                    }, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
            )
            .join(", ")}`,
        responses.flatMap((resp) => {
            return [
                resp.surveyId,
                resp.instanceId,
                resp.userToken,
                resp.questionId,
                resp.content,
                resp.created,
                resp.updated,
            ];
        })
    );

    await db.query(
        `INSERT INTO responses (survey_id, instance_id, user_token, question_id, content, created, updated) VALUES ${responses
            .map(
                (q, i) =>
                    `( $${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${
                        i * 7 + 4
                    }, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
            )
            .join(", ")}`,
        responses.flatMap((resp) => {
            return [
                resp.surveyId,
                resp.instanceId,
                resp.userToken,
                resp.questionId,
                resp.content,
                resp.created,
                resp.updated,
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

export const getResponsesGroupedByInstanceId = async (
    db: Db,
    surveyId: EntityId,
    page: number,
    pageSize: number
): Promise<ResponsesDetailsByInstance[]> => {
    const limitFrom = (page - 1) * pageSize;

    console.log(
        `SELECT instance_id, array_agg(DISTINCT user_token) as user_tokens, max(responses.created) as last_responded,
        json_agg(json_build_object(
            'question_id', responses.question_id,
            'content', responses.content,
            'id', responses.id,
            'tags', array(
                SELECT json_build_object('id', tag_id, 'label', tags.label, 'color', tags.color) FROM tags_responses LEFT JOIN tags ON tags_responses.tag_id = tags.id  WHERE response_id = responses.id
            )
        )) as responses 
        FROM responses 
        WHERE responses.survey_id = $1 GROUP BY responses.instance_id 
        ORDER BY last_responded DESC
        LIMIT $2 OFFSET $3`,
        [surveyId, pageSize, limitFrom]
    );
    const res = await db.query(
        `SELECT instance_id, array_agg(DISTINCT user_token) as user_tokens, max(responses.created) as last_responded,
        json_agg(json_build_object(
            'question_id', responses.question_id,
            'content', responses.content,
            'id', responses.id,
            'tags', array(
                SELECT json_build_object('id', tag_id, 'label', tags.label, 'color', tags.color) FROM tags_responses LEFT JOIN tags ON tags_responses.tag_id = tags.id  WHERE response_id = responses.id
            )
        )) as responses 
        FROM responses 
        WHERE responses.survey_id = $1 GROUP BY responses.instance_id 
        ORDER BY last_responded DESC
        LIMIT $2 OFFSET $3`,
        [surveyId, pageSize, limitFrom]
    );

    const responsesByInstance = res.rows.map((row) => {
        return ResponsesByInstance.parse(fromDbRecord(row));
    });

    return responsesByInstance.map((resp) => {
        const respDetails: ResponsesDetailsByInstance = {
            instanceId: resp.instanceId,
            userToken: resp.userTokens[0],
            lastResponded: resp.lastResponded,
            responses: {},
        };

        resp.responses.forEach((r) => {
            respDetails.responses[r.questionId] = r;
        });
        return respDetails;
    });
};

export const countResponsesByInstanceId = async (
    db: Db,
    surveyId: EntityId
): Promise<number> => {
    const res = await db.query(
        "SELECT COUNT(DISTINCT instance_id) as count FROM responses WHERE responses.survey_id = $1",
        [surveyId]
    );

    return +res.rows[0].count;
};

const lorems = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum.",
    "Velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum.",
    "Fringilla urna porttitor rhoncus dolor purus.",
    "Ultricies mi quis hendrerit dolor. Auctor neque vitae tempus quam. Eu scelerisque felis imperdiet proin fermentum leo.",
    "Vitae congue eu consequat ac felis donec et odio pellentesque. Nunc sed blandit libero volutpat sed cras ornare arcu dui.",
    "Tempor orci eu lobortis elementum nibh tellus molestie.",
];

export const seedResponsesForSurvey = async (
    db: Db,
    survey: SurveyInfo,
    count: number
): Promise<void> => {
    for (let i = 0; i < count; i++) {
        const surveyResponses: SurveyResponse[] = [];
        const instanceId = nanoid(15);
        const userToken = nanoid(40);
        //set random date between now and 2 weeks ago
        const randomDate = new Date(
            Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 14)
        );
        for (const question of survey.questions) {
            surveyResponses.push({
                surveyId: survey.id!,
                instanceId: instanceId,
                userToken: userToken,
                questionId: question.id!,
                created: randomDate,
                updated: randomDate,
                content:
                    question.type === "text"
                        ? lorems[Math.floor(Math.random() * lorems.length)]
                        : question.type === "rating"
                        ? (Math.floor(Math.random() * 5) + 1).toString()
                        : question.options[
                              Math.floor(
                                  Math.random() * question.options.length
                              )
                          ].value,
            });
        }
        //save surveyResponses to db
        console.log(`Saving ${surveyResponses.length} responses`);
        await saveResponses(db, surveyResponses);
        console.log("Saved responses");
    }
};

export const createTag = async (
    db: Db,
    containerId: EntityId,
    tag: Tag
): Promise<Tag> => {
    const res = await db.query(
        "INSERT INTO tags (id, container_id, label, color) VALUES ($1, $2, $3, $4) RETURNING *",
        [newEntityId(), containerId, tag.label, tag.color]
    );

    return Tag.parse(fromDbRecord(res.rows[0]));
};

export const assignTagsToResponse = async (
    db: Db,
    responseId: number,
    tags: Tag[]
): Promise<Tag[]> => {
    //TODO Transaction
    console.log(
        `INSERT INTO tags_responses (response_id, tag_id) VALUES ${tags
            .map((t, i) => `($1, $${i + 2})`)
            .join(", ")} ON CONFLICT (response_id, tag_id) DO NOTHING`,
        [responseId, ...tags.map((t) => t.id)]
    );
    const saveTagsQuery = db.query(
        `INSERT INTO tags_responses (response_id, tag_id) VALUES ${tags
            .map((t, i) => `($1, $${i + 2})`)
            .join(", ")} ON CONFLICT (response_id, tag_id) DO NOTHING`,
        [responseId, ...tags.map((t) => t.id)]
    );

    console.log(
        `DELETE FROM tags_responses WHERE response_id = $1 AND tag_id NOT IN (${tags
            .map((t, i) => `$${i + 2}`)
            .join(", ")})`,
        [responseId, ...tags.map((t) => t.id)]
    );
    const removeOldTagsQuery = db.query(
        `DELETE FROM tags_responses WHERE response_id = $1 AND tag_id NOT IN (${tags
            .map((t, i) => `$${i + 2}`)
            .join(", ")})`,
        [responseId, ...tags.map((t) => t.id)]
    );

    await Promise.all([saveTagsQuery, removeOldTagsQuery]);

    return tags;
};

export const deleteTag = async (
    db: Db,
    containerId: EntityId,
    tagId: EntityId
): Promise<void> => {
    //TODO Transaction
    await db.query("DELETE FROM tags_responses WHERE tag_id = $1", [tagId]);
    await db.query("DELETE FROM tags WHERE id = $1 AND container_id = $2", [
        tagId,
        containerId,
    ]);
};
