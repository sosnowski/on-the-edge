import {
    EntityId,
    Survey,
    SurveyMetadata,
    SurveyStatus,
} from "shared/models/surveys/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    const containerId = EntityId.parse(+request.params["containerId"]);

    const surveys = await env.KV.list<SurveyMetadata>({
        prefix: `Container:${containerId}:Survey:`,
    });

    console.log("Will remove those KEYS!");
    console.log(surveys.keys.map(({ name, metadata }) => name).join(", "));

    const removed = await Promise.all(
        surveys.keys.map(({ name, metadata }) => {
            return env.KV.delete(name);
        })
    );

    return new Response(JSON.stringify(removed));
};