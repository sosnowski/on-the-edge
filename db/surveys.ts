import { nanoid } from "nanoid";
import { Db } from "./client";
import {
    PublishConfig,
    Survey,
    SurveyInfo,
    SurveyQuestion,
} from "shared/models/survey";
import { fromDbRecord, toDbRecord } from "./helper";
import { newEntityId } from "shared/models/base";

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
    const { data, error } = await db
        .from("surveys")
        .select()
        .eq("container_id", containerId)
        .order("updated", { ascending: false });

    if (error) {
        console.error(error);
        throw new Error("Error fetching surveys");
    }

    console.log("Query result: ", data);

    return (data || []).map(parseSurvey);
};

export const createDefaultSurvey = async (db: Db, containerId: string) => {
    console.log("SAVING NEW SURVEY");
    const survey: Survey = {
        id: nanoid(30),
        containerId: containerId,
        name: "New Survey",
        displayType: "fab",
        status: "inactive",
        triggerConfig: {
            type: "fixed",
        },
    };

    const { data, error } = await db.from("surveys").insert(toDbRecord(survey));

    if (error) {
        console.error(error);
        throw new Error("Error inserting survey");
    }

    console.log("SURVEY SAVED", data);

    return survey.id;
};

export const getSurveyById = async (
    db: Db,
    surveyId: string
): Promise<Survey | null> => {
    console.log("GET SURVEY BY ID " + surveyId);

    const { data, error } = await db
        .from("surveys")
        .select()
        .eq("id", surveyId)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Error fetching survey");
    }

    console.log("SURVEY QUERY RESULT: ", data);

    if (!data) {
        return null;
    }

    return parseSurvey(data);
};

export const getSurveyInfoById = async (
    db: Db,
    surveyId: string
): Promise<SurveyInfo | null> => {
    console.log("GET SURVEY INFO BY ID " + surveyId);

    const res = await Promise.all([
        db
            .from("surveys")
            .select("*, containers(name)")
            .eq("id", surveyId)
            .single(),
        db
            .from("questions")
            .select("*")
            .eq("survey_id", surveyId)
            .order("order", { ascending: true }),
    ]);

    console.log("SURVEY INFO QUERY RESULT: ", res[0], res[1]);

    if (res[0].error || res[1].error) {
        console.error(res[0].error || res[1].error);
        throw new Error("Error fetching survey info");
    }

    if (!res[0].data) {
        return null;
    }

    return SurveyInfo.parse({
        ...parseSurvey(res[0].data),
        containerName: res[0].data.containers?.name,
        questions: res[1].data?.map(parseQuestion) || [],
    });
};

export const saveSurveyInfo = async (
    db: Db,
    surveyInfo: SurveyInfo
): Promise<SurveyInfo> => {
    console.log("SAVING SURVEY INFO", surveyInfo);

    const { questions, ...survey } = surveyInfo;

    survey.updated = new Date();
    const saveSurvey = db
        .from("surveys")
        .update(toDbRecord(survey, ["containerName"]))
        .eq("id", survey.id)
        .select()
        .single();

    const questionsRecords = questions.map((q, index) => {
        let config: Record<string, unknown> | null;
        if (q.type === "select") {
            config = {
                options: q.options,
            };
        } else {
            config = null;
        }

        return {
            id: q.id || newEntityId(),
            survey_id: survey.id,
            ...toDbRecord(q, ["options"]),
            order: index,
            config: config,
        };
    });

    console.log("QUESTIONS TO SAVE");
    console.log(questionsRecords);
    const saveQuestions = db
        .from("questions")
        .upsert(questionsRecords)
        .select();

    console.log("QUESTIONS TO REMOVE");
    console.log("ID NOT IN (" + questions.map((q) => q.id).join(",") + ")");
    const removeQuestions = db
        .from("questions")
        .delete()
        .not("id", "in", `(${questions.map((q) => q.id).join(",")})`)
        .eq("survey_id", survey.id);

    const res = await Promise.all([saveSurvey, saveQuestions, removeQuestions]);

    if (res[0].error || res[1].error || res[2].error) {
        console.error(res[0].error || res[1].error || res[2].error);
        throw new Error("Error saving survey info");
    }

    console.log("SURVEY INFO SAVED", res[0].data, res[1].data, res[2].data);

    return SurveyInfo.parse({
        ...surveyInfo,
        ...parseSurvey(res[0].data),
        questions: res[1].data?.map(parseQuestion) || [],
    });
};

export const publishSurvey = async (
    db: Db,
    surveyId: string,
    publishConfig: PublishConfig
): Promise<Survey> => {
    console.log("PUBLISHING SURVEY", surveyId);

    const { data, error } = await db
        .from("surveys")
        .update({
            published: publishConfig,
        })
        .eq("id", surveyId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Error publishing survey");
    }

    console.log("SURVEY PUBLISHED", data);

    return Survey.parse(fromDbRecord<Survey>(data));
};

export const unPublishSurvey = async (
    db: Db,
    surveyId: string
): Promise<Survey> => {
    console.log("UNPUBLISHING SURVEY", surveyId);

    const { data, error } = await db
        .from("surveys")
        .update({
            published: null,
        })
        .eq("id", surveyId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Error unpublishing survey");
    }

    console.log("SURVEY UNPUBLISHED", data);

    return Survey.parse(fromDbRecord<Survey>(data));
};
