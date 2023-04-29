import { error } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { getAllContainers } from "db/containers";
import type { PageServerLoad } from "./$types";

export const load = (async ({ depends }) => {
	depends("app:containers");
	let containers = [];
	try {
		console.log("Getting all containers");
		const db = getDb();
		containers = await getAllContainers(db);

		console.log("Containers loaded: ", containers);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}

	return {
		containers: containers,
	};
}) satisfies PageServerLoad;
