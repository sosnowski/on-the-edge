import { getDb } from "$lib/db";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { createDefaultSurvey } from "db/surveys";
import { EntityId } from "shared/models/base";

export const POST = (async ({ request }) => {
	console.log("CREATE NEW SURVEY");
	const data = await request.formData();

	let surveyId;
	let containerId;
	try {
		containerId = EntityId.parse(data.get("containerId") as string);
		const db = getDb();

		surveyId = await createDefaultSurvey(db, containerId);
		console.log("NEW SURVEY ID: ", surveyId);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}

	throw redirect(303, `/containers/${containerId}/surveys/${surveyId}`);
}) satisfies RequestHandler;
