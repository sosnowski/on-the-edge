import { error, redirect } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId } from "shared/models/base";
import { createDefaultSurvey, getSurveyInfoById } from "db/surveys";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	const containerId = EntityId.parse(params.containerId);
	const db = await getDb();

	const surveyId = EntityId.parse(params.surveyId);
	const survey = getSurveyInfoById(db, surveyId);

	if (!survey) {
		throw error(404, "Survey not found");
	}

	return {
		survey: survey,
	};
}) satisfies PageServerLoad;
