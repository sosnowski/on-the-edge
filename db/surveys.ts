import { nanoid } from "nanoid";
import { Db } from "./client";
import { Survey, SurveyInfo, SurveyQuestion } from "shared/models/survey";
import { fromDbRecord, toDbRecord } from "./helper";

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

    return (data || []).map((row) => Survey.parse(fromDbRecord(row)));
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
        ...fromDbRecord<Survey>(res[0].data),
        containerName: res[0].data.containers?.name,
        questions:
            res[1].data?.map((row) => {
                if (row.type === "select") {
                    row.options = row.config?.options || [];
                }
                return fromDbRecord(row);
            }) || [],
    });
};

export const saveSurveyInfo = async (
    db: Db,
    surveyInfo: SurveyInfo
): Promise<void> => {
    console.log("SAVING SURVEY INFO", surveyInfo);

    const { questions, ...survey } = surveyInfo;

    const saveSurvey = db
        .from("surveys")
        .update(toDbRecord(survey, ["containerName"]))
        .eq("id", survey.id);

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
            id: q.id,
            survey_id: survey.id,
            ...toDbRecord(q, ["options"]),
            order: index,
            config: config,
        };
    });

    console.log("QUESTIONS TO SAVE");
    console.log(questionsRecords);
    const saveQuestions = db.from("questions").upsert(questionsRecords);

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
};
