import { json, type RequestHandler } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { unPublishSurvey } from "db/surveys";
import { EntityId } from "shared/models/base";

export const POST = (async ({ request, params }) => {
	console.log("UNPUBLISH SURVEY");
	const surveyId = EntityId.parse(params.surveyId);
	const db = getDb();

	const survey = await unPublishSurvey(db, surveyId);

	console.log("SURVEY UNPUBLISHED");
	console.log(survey);

	return json(survey);
}) satisfies RequestHandler;
