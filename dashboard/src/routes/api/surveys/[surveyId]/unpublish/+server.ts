import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { publishSurvey, getSurveyInfoById, unPublishSurvey } from "db/surveys";
import {
	publishSurvey as apiPublishSurvey,
	unpublishSurvey as apiUnpublishSurvey,
} from "$lib/surveys_api";
import { EntityId } from "shared/models/base";

export const POST = (async ({ request, params }) => {
	console.log("PUBLISH SURVEY");
	const surveyId = EntityId.parse(params.surveyId);
	const db = await getDb();

	const surveyInfo = await getSurveyInfoById(db, surveyId);

	if (!surveyInfo) {
		throw error(404, "Survey not found");
	}

	try {
		await apiUnpublishSurvey(surveyInfo.containerId, surveyInfo.id!);
	} catch (e) {
		console.error("Failed to unpublish survey to API", e);
		throw error(500, "Failed to unpublish survey to API");
	}

	try {
		console.log("Saving unpublished survey to DB");
		const survey = await unPublishSurvey(db, surveyId);

		console.log("Survey unpublished!");
		return json(survey);
	} catch (e) {
		console.error("Failed to save unpublished survey to DB", e);

		console.log("Rolling back survey unpublish");
		await apiPublishSurvey(surveyInfo.containerId, surveyInfo);
		throw error(500, "Failed to unpublish survey");
	}
}) satisfies RequestHandler;
