import { EntityId, SurveyInfo, Token } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";
import { getSurvey } from "../store";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	const containerId = EntityId.parse(request.params["containerId"]);
	const surveyId = EntityId.parse(request.params["surveyId"]);
	const userToken = Token.parse(request.headers.get("x-user-token"));

	const data = await getSurvey(env, containerId, surveyId);

	if (!data) {
		return new Response("", { status: 404 });
	}

	//parsing is theoretically not needed here and we could just return string json but it allows us to validate
	return new Response(JSON.stringify(SurveyInfo.parse(data)));
};
