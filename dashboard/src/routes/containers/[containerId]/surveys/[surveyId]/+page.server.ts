import { error, redirect } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId } from "shared/models/base";
import { getAllSurveysByContainer, createDefaultSurvey, getSurveyInfoById } from "db/surveys";
import type { PageServerLoad } from "./$types";
import { nanoid } from "nanoid";

export const load = (async ({ params }) => {
	const containerId = EntityId.parse(params.containerId);
	const db = getDb();

	if (params.surveyId === "create") {
		// create default survey and redirect to it
		console.log("CREATE NEW SURVEY");
		let surveyId;
		try {
			surveyId = await createDefaultSurvey(db, containerId);
			console.log("NEW SURVEY ID: ", surveyId);
		} catch (err) {
			console.error(err);
			throw error(500, "Internal server error");
		}

		throw redirect(303, `/containers/${containerId}/surveys/${surveyId}`);
	} else {
		const surveyId = EntityId.parse(params.surveyId);
		const survey = getSurveyInfoById(db, surveyId);

		if (!survey) {
			throw error(404, "Survey not found");
		}

		return {
			survey: survey,
		};
	}
}) satisfies PageServerLoad;
