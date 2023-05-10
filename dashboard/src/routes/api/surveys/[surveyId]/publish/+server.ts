import { json, type RequestHandler, error } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { publishSurvey, getSurveyInfoById, unPublishSurvey } from "db/surveys";
import { publishSurvey as apiPublishSurvey } from "$lib/surveys_api";
import { EntityId } from "shared/models/base";

export const POST = (async ({ params }) => {
	console.log("PUBLISH SURVEY");
	const surveyId = EntityId.parse(params.surveyId);
	const db = getDb();

	console.log("Saving survey to DB");
	const survey = await publishSurvey(db, surveyId, {
		start: new Date(),
	});

	const surveyInfo = await getSurveyInfoById(db, surveyId);

	if (!surveyInfo) {
		throw error(404, "Survey not found");
	}

	try {
		console.log("Publishing survey!");
		await apiPublishSurvey(surveyInfo.containerId, surveyInfo);
	} catch (e) {
		console.error("Failed to publish survey", e);
		console.log("Rolling back survey publish");
		await unPublishSurvey(db, surveyId);

		throw error(500, "Failed to publish survey");
	}

	console.log("SURVEY PUBLISHED");
	console.log(surveyInfo);

	return json(survey);
}) satisfies RequestHandler;
