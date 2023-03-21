import { EntityId, Survey } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    const containerId = EntityId.parse(request.params["containerId"]);

    const payload = await request.json();
    const survey: Survey = Survey.parse(payload);

    const KVKey = `Container:${containerId}:Survey:${survey.surveyId}`;

    await env.KV.put(KVKey, JSON.stringify(survey), {
        metadata: survey.config,
    });

    return new Response("");
};
