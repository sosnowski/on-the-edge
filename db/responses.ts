import { SurveyResponse } from "shared/models/response";
import { Db } from "./client";
import { toDbRecord } from "./helper";

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

export const getResponsesBySurveyId = async (
    db: Db,
    surveyId: string
): Promise<SurveyResponse[]> => {
    console.log("Getting responses for survey", surveyId);

    const res = await db
        .from("responses")
        .select("*")
        .eq("survey_id", surveyId)
        .order("order", { ascending: false });

    console.log(res);

    const { error, data } = res;

    if (error) {
        console.error(error);
        throw new Error("Error getting responses");
    }

    return data.map((row) => SurveyResponse.parse(row));
};

/**
 * SELECT instance_id, json_agg(json_build_object('question_id', question_id, 'label', questions.label, 'content', content)) as response_ids FROM responses LEFT JOIN questions ON responses.question_id = questions.id GROUP BY instance_id;
 */
