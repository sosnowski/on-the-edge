import { EntityId, SurveyResponse } from "shared/models/response";
import { saveResponses } from "db/responses";
import { Env } from "../env";
import { RouterRequest } from "../router";
import { getDb } from "../db";

// const sendEvenToQueue = async (
// 	queue: Fetcher,
// 	request: Request,
// 	event: SurveyEvent,
// ): Promise<void> => {
// 	console.log("Sending event to Fetcher!");
// 	const res = await queue.fetch(request.clone());

// 	console.log("Sent with status " + res.status);

// 	if (!res.ok) {
// 		console.error("Unable to send event to queue!!");
// 		console.log(res.status);
// 	}
// 	return;
// };

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	console.log("PUT RESPONSE HANDLER");
	const surveyId = EntityId.parse(request.params["surveyId"]);

	let response;
	try {
		const payload = await request.json();
		response = SurveyResponse.parse(payload);
		if (response.surveyId !== surveyId) {
			throw new Error("Invalid surveyId");
		}
	} catch (e) {
		console.log(e);
		return new Response("Invalid event payload", { status: 400 });
	}

	console.log("SAVING RESPONSE EVENT TO DB", response);

	try {
		const db = getDb(env);
		await saveResponses(db, [response]);
	} catch (e) {
		console.error("Unable to save response to db", e);
		return new Response("Unable to save response to db", { status: 500 });
	}

	return new Response("OK", { status: 200 });
};