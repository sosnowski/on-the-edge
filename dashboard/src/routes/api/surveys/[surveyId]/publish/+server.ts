import { json, type RequestHandler } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { publishSurvey } from "db/surveys";
import { EntityId } from "shared/models/base";

export const POST = (async ({ params }) => {
	console.log("PUBLISH SURVEY");
	const surveyId = EntityId.parse(params.surveyId);
	const db = getDb();

	const survey = await publishSurvey(db, surveyId, {
		start: new Date(),
	});

	console.log("SURVEY PUBLISHED");
	console.log(survey);

	return json(survey);
}) satisfies RequestHandler;
