import { json, type RequestHandler } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { saveSurveyInfo } from "db/surveys";
import { SurveyInfo } from "shared/models/survey";

export const PUT = (async ({ request }) => {
	const surveyInfo = SurveyInfo.parse(await request.json());
	const db = getDb();

	console.log("UPDATE SURVEY INFO");
	console.log(surveyInfo);

	await saveSurveyInfo(db, surveyInfo);
	return json(surveyInfo);
}) satisfies RequestHandler;
