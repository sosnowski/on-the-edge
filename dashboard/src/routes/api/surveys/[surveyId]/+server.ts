import { json, type RequestHandler } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { saveSurveyInfo } from "db/surveys";
import { SurveyInfo } from "shared/models/survey";

export const PUT = (async ({ request }) => {
	const data = await request.json();
	const surveyInfo = SurveyInfo.parse(data);
	const db = getDb();

	console.log("UPDATE SURVEY INFO");
	console.log(surveyInfo);

	const updatedSurvey = await saveSurveyInfo(db, surveyInfo);
	return json(updatedSurvey);
}) satisfies RequestHandler;
