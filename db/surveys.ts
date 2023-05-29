import { nanoid } from "nanoid";
import { Db } from "./client";
import {
    PublishConfig,
    QuestionDbRecord,
    Survey,
    SurveyInfo,
    SurveyQuestion,
} from "shared/models/survey";
import { fromDbRecord, toDbRecord } from "./helper";
import { EntityId, newEntityId } from "shared/models/base";

export const parseSurvey = (row: Record<string, any>): Survey => {
    return Survey.parse(fromDbRecord<Survey>(row));
};

export const parseQuestion = (row: Record<string, any>): SurveyQuestion => {
    if (row.type === "select") {
        row.options = row.config?.options || [];
    }
    return SurveyQuestion.parse(fromDbRecord<SurveyQuestion>(row));
};

export const getAllSurveysByContainer = async (
    db: Db,
    containerId: string
): Promise<Survey[]> => {
    console.log("Executing getAllSurveysByContainer query");

    const res = await db.query(
        "SELECT * FROM surveys WHERE container_id = $1 ORDER BY updated DESC",
        [containerId]
    );

    console.log("Query result: ", res);

    return (res.rows || []).map(parseSurvey);
};

export const createDefaultSurvey = async (
    db: Db,
    containerId: string
): Promise<EntityId> => {
    console.log("SAVING NEW SURVEY");
    const survey: Survey = {
        id: newEntityId(),
        containerId: containerId,
        name: "New Survey",
        displayType: "fab",
        status: "inactive",
        triggerConfig: {
            type: "onload",
            pageGlob: undefined,
            limit: "session",
        },
    };

    const res = await db.query(
        "INSERT INTO surveys (id, container_id, name, display_type, status, trigger_config) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
            survey.id,
            survey.containerId,
            survey.name,
            survey.displayType,
            survey.status,
            survey.triggerConfig,
        ]
    );

    if (!res.rows || res.rows.length !== 1) {
        throw new Error("Error inserting survey");
    }

    console.log("SURVEY SAVED", res.rows);

    return res.rows[0].id;
};

export const getSurveyById = async (
    db: Db,
    surveyId: string
): Promise<Survey | null> => {
    console.log("GET SURVEY BY ID " + surveyId);

    const res = await db.query(
        "SELECT * FROM surveys WHERE id = $1 ORDER BY updated DESC",
        [surveyId]
    );

    console.log("SURVEY QUERY RESULT: ", res);

    if (!res.rows || res.rows.length !== 1) {
        return null;
    }

    return parseSurvey(res.rows[0]);
};

export const getSurveyInfoById = async (
    db: Db,
    surveyId: string
): Promise<SurveyInfo | null> => {
    console.log("GET SURVEY INFO BY ID " + surveyId);

    const res = await Promise.all([
        db.query(
            "SELECT surveys.*, containers.name as container_name FROM surveys LEFT JOIN containers ON surveys.container_id = containers.id WHERE surveys.id = $1",
            [surveyId]
        ),
        db.query(
            'SELECT * FROM questions WHERE survey_id = $1 ORDER BY "order" ASC',
            [surveyId]
        ),
    ]);

    console.log("SURVEY INFO QUERY RESULT: ", res[0], res[1]);

    if (!res[0].rows || res[0].rows.length !== 1) {
        return null;
    }

    return SurveyInfo.parse({
        ...parseSurvey(res[0].rows[0]),
        containerName: res[0].rows[0].container_name,
        questions: res[1].rows?.map(parseQuestion) || [],
    });
};

export const saveSurveyInfo = async (
    db: Db,
    surveyInfo: SurveyInfo
): Promise<SurveyInfo> => {
    console.log("SAVING SURVEY INFO", surveyInfo);
    //TODO add transaction

    const { questions, ...survey } = surveyInfo;

    survey.updated = new Date();

    const saveSurvey = db.query(
        "UPDATE surveys SET name = $1, display_type = $2, status = $3, trigger_config = $4, updated = $5 WHERE id = $6 RETURNING *",
        [
            survey.name,
            survey.displayType,
            survey.status,
            survey.triggerConfig,
            survey.updated,
            survey.id,
        ]
    );

    const questionsToSave = questions.map((q, i) => {
        return {
            ...q,
            id: q.id || newEntityId(),
            order: i,
        };
    });
    console.log("QUESTIONS TO SAVE");
    console.log(questionsToSave);
    console.log(
        'INSERT INTO questions (id, survey_id, label, type, "order", config) VALUES ' +
            questionsToSave
                .map(
                    (q, i) =>
                        `( $${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${
                            i * 6 + 4
                        }, $${i * 6 + 5}, $${i * 6 + 6})`
                )
                .join(",") +
            ' ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, type = EXCLUDED.type, "order" = EXCLUDED.order, config = EXCLUDED.config RETURNING *',
        questionsToSave.flatMap((q) => [
            q.id,
            surveyInfo.id,
            q.label,
            q.type,
            q.order,
            q.type === "select" ? { options: q.options } : undefined,
        ])
    );

    const saveQuestions = db.query(
        'INSERT INTO questions (id, survey_id, label, type, "order", config) VALUES ' +
            questionsToSave
                .map(
                    (q, i) =>
                        `( $${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${
                            i * 6 + 4
                        }, $${i * 6 + 5}, $${i * 6 + 6})`
                )
                .join(",") +
            ' ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, type = EXCLUDED.type, "order" = EXCLUDED.order, config = EXCLUDED.config RETURNING *',
        questionsToSave.flatMap((q) => [
            q.id,
            surveyInfo.id,
            q.label,
            q.type,
            q.order,
            q.type === "select" ? { options: q.options } : undefined,
        ])
    );

    console.log("QUESTIONS TO REMOVE");
    console.log(
        "ID NOT IN (" + questionsToSave.map((q) => q.id).join(",") + ")"
    );

    console.log("REMOVE QUESTIONS QUERY");
    console.log(
        "DELETE FROM questions WHERE survey_id = $1 AND id NOT IN (" +
            questionsToSave.map((q, i) => `$${i + 2}`).join(",") +
            ")",
        [surveyInfo.id, ...questionsToSave.map((q) => q.id)]
    );

    const removeQuestions = db.query(
        "DELETE FROM questions WHERE survey_id = $1 AND id NOT IN (" +
            questionsToSave.map((q, i) => `$${i + 2}`).join(",") +
            ")",
        [surveyInfo.id, ...questionsToSave.map((q) => q.id)]
    );

    const res = await Promise.all([saveSurvey, saveQuestions, removeQuestions]);

    console.log("SURVEY INFO SAVED", res[0], res[1], res[2]);

    return SurveyInfo.parse({
        ...surveyInfo,
        ...parseSurvey(res[0].rows[0]),
        questions: res[1].rows?.map(parseQuestion) || [],
    });
};

export const publishSurvey = async (
    db: Db,
    surveyId: string,
    publishConfig: PublishConfig
): Promise<Survey> => {
    console.log("PUBLISHING SURVEY", surveyId);

    const res = await db.query(
        "UPDATE surveys SET published = $1 WHERE id = $2 RETURNING *",
        [publishConfig, surveyId]
    );

    if (!res.rows || res.rows.length !== 1) {
        throw new Error("Error publishing survey");
    }

    console.log("SURVEY PUBLISHED", res);

    return Survey.parse(fromDbRecord<Survey>(res.rows[0]));
};

export const unPublishSurvey = async (
    db: Db,
    surveyId: string
): Promise<Survey> => {
    console.log("UNPUBLISHING SURVEY", surveyId);

    const res = await db.query(
        "UPDATE surveys SET published = null WHERE id = $1 RETURNING *",
        [surveyId]
    );

    if (!res.rows || res.rows.length !== 1) {
        throw new Error("Error unpublishing survey");
    }

    console.log("SURVEY UNPUBLISHED", res);

    return Survey.parse(fromDbRecord<Survey>(res.rows[0]));
};
