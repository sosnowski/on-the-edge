import { EntityId, Token } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";
import { saveUserImpression } from "../store";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	console.log("POST SURVEY IMPRESSION");
	let surveyId: EntityId;
	let userToken: Token;
	try {
		surveyId = EntityId.parse(request.params["surveyId"]);
		userToken = Token.parse(request.headers.get("x-user-token"));
	} catch (e) {
		console.error(e);
		return new Response("Invalid survey id or user token", { status: 400 });
	}

	try {
		console.log("Saving impression");
		await saveUserImpression(env, surveyId, userToken);
		console.log("Saved impression");

		return new Response("");
	} catch (e) {
		console.error(e);
		return new Response("Unable to save impression", { status: 500 });
	}
};
