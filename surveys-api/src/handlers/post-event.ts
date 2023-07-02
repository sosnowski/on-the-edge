import { EntityId, Token } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";
import { saveUserImpression } from "../store";
import { SurveyEvent } from "shared/models/response";
import { saveEvents } from "db/events";
import { getDb } from "../db";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	console.log("POST SURVEY EVENT");
	let surveyId: EntityId;
	let userToken: Token;
	let event: SurveyEvent;
	try {
		surveyId = EntityId.parse(request.params["surveyId"]);
		userToken = Token.parse(request.headers.get("x-user-token"));
		const payload: Record<string, unknown> = await request.json();
		event = SurveyEvent.parse({
			...payload,
			surveyId,
			userToken,
		});
	} catch (e) {
		console.error(e);
		return new Response("Invalid survey id or user token", { status: 400 });
	}

	try {
		console.log("Saving Survey event");
		if (event.type === "displayed") {
			console.log("Saving impression");
			await saveUserImpression(env, surveyId, userToken);
		}

		console.log("Saving event to DB");
		console.log(event);

		const db = await getDb(env);
		await saveEvents(db, [event]);
		return new Response("");
	} catch (e) {
		console.error(e);
		return new Response("Unable to save events", { status: 500 });
	}
};
