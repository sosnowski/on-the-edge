import { SurveyInfo, SurveyMetadata, EntityId } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	const containerId = EntityId.parse(request.params["containerId"]);

	console.log("Received survey publish request for container", containerId);

	const payload = await request.json();
	const survey: SurveyInfo = SurveyInfo.parse(payload);

	const KVKey = `Container:${containerId}:Survey:${survey.id}`;

	console.log("Saving survey to KV, with key", KVKey);

	await env.KV.put(KVKey, JSON.stringify(survey), {
		metadata: {
			surveyId: survey.id!,
			displayType: survey.displayType,
			status: survey.status,
			triggerConfig: survey.triggerConfig,
		} satisfies SurveyMetadata,
	});

	return new Response("");
};
