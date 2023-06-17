import { getDb } from "$lib/db";
import { error, json, text, type RequestHandler } from "@sveltejs/kit";
import { createTag, deleteTag } from "db/responses";
import { EntityId, Tag } from "shared/models/response";

export const DELETE = (async ({ request, params }) => {
	console.log("DELETE TAG");
	let tagId;
	let containerId;
	try {
		containerId = EntityId.parse(params.containerId);
		tagId = EntityId.parse(params.tagId);
	} catch (e) {
		console.error(e);
		throw error(400, "Invalid tag data");
	}

	try {
		const db = await getDb();
		await deleteTag(db, containerId, tagId);

		return text("");
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies RequestHandler;
