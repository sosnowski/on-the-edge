import { EntityId, Survey } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    const containerId = EntityId.parse(request.params["containerId"]);
    const surveyId = EntityId.parse(request.params["surveyId"]);

    const KVKey = `Container:${containerId}:Survey:${surveyId}`;
    const data = await env.KV.get(KVKey, "json");

    //parsing is theoretically not needed here and we could just return string json but it allows us to validate
    return new Response(JSON.stringify(Survey.parse(data)));
};
