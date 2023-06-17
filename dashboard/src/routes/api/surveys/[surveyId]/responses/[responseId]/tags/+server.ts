import { json, type RequestHandler, error } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId, Tag } from "shared/models/response";
import { assignTagsToResponse } from "db/responses";

export const PUT = (async ({ request, params }) => {
	let tags: Tag[];
	let responseId: number;
	try {
		responseId = +params.responseId!;
		if (!responseId) {
			throw new Error("Invalid response ID");
		}
		const data = await request.json();
		if (!data || !Array.isArray(data)) {
			throw new Error("Invalid request");
		}
		tags = data.map((tag) => {
			return Tag.parse(tag);
		});
	} catch (err) {
		console.error(err);
		throw error(400, "Invalid request");
	}

	try {
		const db = await getDb();
		const res = await assignTagsToResponse(db, responseId, tags);

		return json(res);
	} catch (e) {
		console.error("Failed to save tags!", e);
		throw error(500, "Failed to save tags!");
	}
}) satisfies RequestHandler;
