import { EntityId } from "shared/models/base";
import type { LayoutServerLoad } from "./$types";
import { getContainerById } from "db/containers";
import { getDb } from "$lib/db";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
	console.log("CONTAINER ID LAYOUT");
	const containerId = EntityId.parse(params.containerId);
	try {
		const db = await getDb();
		const container = await getContainerById(db, containerId);
		console.log("CONTAINER", container);
		return {
			container: container,
		};
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies LayoutServerLoad;
