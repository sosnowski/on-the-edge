import { json, type RequestHandler } from "@sveltejs/kit";
import { nanoid } from "nanoid";

export const POST = (async ({ request }) => {
	// create default survey and return survey Id

	return json({
		surveyId: nanoid(),
	});
}) satisfies RequestHandler;
