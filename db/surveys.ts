import { Db } from "./client";
import { Survey } from "shared/models/base/survey";

export const getAllSurveysByContainer = async (
    db: Db,
    containerId: number
): Promise<Survey[]> => {
    console.log("Executing SELECT * query");
    const res = await db
        .from("surveys")
        .select()
        .eq("containerId", containerId)
        .order("created", { ascending: false });

    console.log("Query result: ", res);

    return (res.data || []).map((row) => Survey.parse(row));
};
