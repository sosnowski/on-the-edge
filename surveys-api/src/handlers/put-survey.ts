import { SurveyInfo, SurveyMetadata, EntityId } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";
import { saveSurvey } from "../store";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	const containerId = EntityId.parse(request.params["containerId"]);

	console.log("Received survey publish request for container", containerId);

	const payload = await request.json();
	const survey: SurveyInfo = SurveyInfo.parse(payload);

	console.log("Saving survey to KV");

	await saveSurvey(env, survey);

	return new Response("");
};
