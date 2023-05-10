import { EntityId } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	const containerId = EntityId.parse(request.params["containerId"]);
	const surveyId = EntityId.parse(request.params["surveyId"]);

	const KVKey = `Container:${containerId}:Survey:${surveyId}`;
	await env.KV.delete(KVKey);

	return new Response("");
};
