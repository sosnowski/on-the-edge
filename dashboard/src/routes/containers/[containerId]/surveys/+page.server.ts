import { error } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import { EntityId } from 'shared/models/base/base';
import { getAllSurveysByContainer } from 'db/surveys';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const containerId = EntityId.parse(+params.containerId);
	let surveys = [];
	try {
		console.log('Getting all containers');
		const db = await getDb();
		surveys = await getAllSurveysByContainer(db, containerId);

		console.log('surveys loaded: ', surveys);
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal server error');
	}

	return {
		surveys: surveys,
		containerId: containerId
	};
}) satisfies PageServerLoad;
