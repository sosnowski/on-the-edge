import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/db';
import type { z } from 'zod';
import { Container } from 'shared/models/base/container';
import { createContainer } from 'db/containers';

const ContainerPayload = Container.pick({ name: true, description: true });
type ContainerPayload = z.infer<typeof ContainerPayload>;

export const actions = {
	default: async ({ request }) => {
		console.log('Default action');
		//load form data
		const formData = await request.formData();

		const payload: Record<string, unknown> = {};
		for (const [key, value] of formData.entries()) {
			payload[key] = value;
		}

		let containerPayload: ContainerPayload;
		try {
			containerPayload = ContainerPayload.parse(payload);
		} catch (e) {
			return {
				success: false,
				error: e
			};
		}

		const db = getDb();
		const container = await createContainer(db, {
			name: containerPayload.name,
			description: containerPayload.description
		});

		console.log('Container created: ', container);

		return {
			success: true,
			container: container
		};
	}
} satisfies Actions;
