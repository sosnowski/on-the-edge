import { Db } from "db/client";
import { saveResponses } from "db/responses";
import { ResponseEvent, SurveyEvent } from "shared/models/survey";

export const handleEvents = async (
    db: Db,
    events: SurveyEvent[]
): Promise<void> => {
    console.log("Handling Events");
    console.log(events);
    const responses = events
        .filter((e) => e.type === "response")
        .map((e) => e as ResponseEvent);
    await saveResponses(db, responses);
};
