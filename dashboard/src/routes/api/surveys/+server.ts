import { json, type RequestHandler } from "@sveltejs/kit";
import { newEntityId } from "shared/models/base";

export const POST = (async ({ request }) => {
	// create default survey and return survey Id

	return json({
		surveyId: newEntityId(),
	});
}) satisfies RequestHandler;
