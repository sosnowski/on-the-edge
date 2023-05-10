import { json, type RequestHandler, error } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { publishSurvey, getSurveyInfoById, unPublishSurvey } from "db/surveys";
import {
	publishSurvey as apiPublishSurvey,
	unpublishSurvey as apiUnpublishSurvey,
} from "$lib/surveys_api";
import { EntityId } from "shared/models/base";

export const POST = (async ({ params }) => {
	console.log("PUBLISH SURVEY");
	const surveyId = EntityId.parse(params.surveyId);
	const db = getDb();

	const surveyInfo = await getSurveyInfoById(db, surveyId);

	if (!surveyInfo) {
		throw error(404, "Survey not found");
	}

	try {
		await apiPublishSurvey(surveyInfo.containerId, surveyInfo);
	} catch (e) {
		console.error("Failed to publish survey to API", e);
		throw error(500, "Failed to publish survey to API");
	}

	try {
		console.log("Saving published survey to DB");
		const survey = await publishSurvey(db, surveyId, {
			start: new Date(),
		});

		console.log("Survey published");
		return json(survey);
	} catch (e) {
		console.error("Failed to save published survey to DB", e);

		console.log("Rolling back survey publish");
		await apiUnpublishSurvey(surveyInfo.containerId, surveyInfo.id!);
		throw error(500, "Failed to publish survey");
	}
}) satisfies RequestHandler;
