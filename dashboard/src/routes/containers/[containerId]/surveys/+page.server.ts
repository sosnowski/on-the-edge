import { error } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId } from "shared/models/base";
import { getAllSurveysByContainer } from "db/surveys";
import type { PageServerLoad } from "./$types";
import { getContainerById } from "db/containers";

export const load = (async ({ params }) => {
	const containerId = EntityId.parse(params.containerId);

	try {
		console.log("Getting all containers");
		const db = await getDb();

		const res = await Promise.all([
			getContainerById(db, containerId),
			getAllSurveysByContainer(db, containerId),
		]);

		if (!res[0]) {
			throw error(404, "Container not found");
		}

		return {
			container: res[0],
			surveys: res[1],
		};
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies PageServerLoad;
