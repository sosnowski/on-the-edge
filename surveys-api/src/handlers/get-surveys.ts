import {
    EntityId,
    Survey,
    SurveyConfig,
    SurveyStatus,
} from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    const containerId = EntityId.parse(request.params["containerId"]);

    const surveys = await env.KV.list<SurveyConfig>({
        prefix: `Container:${containerId}:Survey:`,
    });

    console.log("GOT KEYS!");
    console.log(surveys);

    const results: Record<EntityId, SurveyConfig> = {};

    surveys.keys
        .filter(({ name, metadata }) => {
            return metadata && metadata.status === "active";
        })
        .forEach(({ name, metadata }) => {
            const surveyId = name.split(":").splice(-1, 1)[0];
            results[surveyId] = metadata!;
        });

    return new Response(JSON.stringify(results));
};
