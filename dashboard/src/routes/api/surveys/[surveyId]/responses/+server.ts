import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { getSurveyInfoById } from "db/surveys";

import { EntityId } from "shared/models/base";
import { seedResponsesForSurvey } from "db/responses";

export const POST = (async ({ request, params }) => {
	console.log("PUBLISH SURVEY");
	const surveyId = EntityId.parse(params.surveyId);
	const db = await getDb();

	const surveyInfo = await getSurveyInfoById(db, surveyId);

	if (!surveyInfo) {
		throw error(404, "Survey not found");
	}

	try {
		await seedResponsesForSurvey(db, surveyInfo, 50);

		return json({ success: true });
	} catch (e) {
		console.error("Failed to seed responses!", e);
		throw error(500, "Failed to seed responses!");
	}
}) satisfies RequestHandler;
