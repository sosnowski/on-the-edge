import { getDb } from "$lib/db";
import { error, json, redirect, type RequestHandler } from "@sveltejs/kit";
import { createContainer } from "db/containers";
import { Container } from "shared/models/container";

export const POST = (async ({ request }) => {
	console.log("CREATE NEW CONTAINER");
	let container;
	try {
		container = Container.parse(await request.json());
	} catch (e) {
		console.error(e);
		throw error(400, "Invalid container data");
	}

	try {
		const db = await getDb();
		const newContainer = await createContainer(db, container);

		return json(newContainer);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies RequestHandler;
