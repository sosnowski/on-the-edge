import { getDb } from "$lib/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { createTag } from "db/responses";
import { EntityId, Tag } from "shared/models/response";

export const POST = (async ({ request, params }) => {
	console.log("CREATE NEW TAG");
	let tag;
	let containerId;
	try {
		containerId = EntityId.parse(params.containerId);
		tag = Tag.parse(await request.json());
	} catch (e) {
		console.error(e);
		throw error(400, "Invalid tag data");
	}

	try {
		const db = await getDb();
		const newTag = await createTag(db, containerId, tag);

		return json(newTag);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies RequestHandler;

export const GET = (async ({ params }) => {
	console.log("GET TAGS");
	let containerId;
	try {
		containerId = EntityId.parse(params.containerId);
	} catch (e) {
		console.error(e);
		throw error(400, "Invalid container ID");
	}

	try {
		const db = await getDb();
		const tags = await db.query(`SELECT * FROM tags WHERE container_id = $1 ORDER BY label ASC`, [
			containerId,
		]);

		return json(tags.rows);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies RequestHandler;
