import { error } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import { getAllContainers, createContainer } from 'db/containers';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	let containers = [];
	try {
		console.log('Getting all containers');
		const db = getDb();
		containers = await getAllContainers(db);

		console.log('Containers loaded: ', containers);
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal server error');
	}

	return {
		containers: containers
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		console.log('Default action');
		//load form data
		const formData = await request.formData();

		if (!formData.get('name') || typeof formData.get('name') !== 'string') {
			return {
				success: false,
				message: 'Name is required'
			};
		}

		const db = await getDb();
		const container = await createContainer(db, {
			name: formData.get('name') as string,
			description: (formData.get('description') as string) || ''
		});

		console.log('Container created: ', container);

		return {
			success: true
		};
	}
} satisfies Actions;
