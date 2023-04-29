import { getDb } from "$lib/db";
import { error, json, redirect, type RequestHandler } from "@sveltejs/kit";
import { createContainer, updateContainer } from "db/containers";
import { EntityId } from "shared/models/base.js";
import { Container } from "shared/models/container";

export const PUT = (async ({ request, params }) => {
	console.log("UPDATE CONTAINER");
	let container;
	let containerId;
	try {
		containerId = EntityId.parse(params.containerId);
		container = Container.parse(await request.json());
	} catch (e) {
		console.error(e);
		throw error(400, "Invalid container data");
	}

	try {
		const db = getDb();
		const updatedContainer = await updateContainer(db, { ...container, id: containerId });

		return json(updatedContainer);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies RequestHandler;
