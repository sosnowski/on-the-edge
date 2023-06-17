import { writable, type Writable } from "svelte/store";
import { EntityId, Tag } from "shared/models/response";

export const tags = writable<Tag[]>([]);

const tagsPerContainer: Record<EntityId, Writable<Tag[]>> = {};

const loadTags = async (containerId: EntityId): Promise<Tag[]> => {
	try {
		const res = await fetch(`/api/containers/${containerId}/tags`);
		if (!res.ok) {
			throw new Error(`Failed to load tags for container ${containerId}`);
		}
		const data = await res.json();
		if (!Array.isArray(data)) {
			throw new Error(`Invalid response for tags for container ${containerId}`);
		}
		const tags = data.map((t) => Tag.parse(t));

		return tags;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const createTagRequest = async (containerId: EntityId, tag: Tag): Promise<Tag> => {
	try {
		const res = await fetch(`/api/containers/${containerId}/tags`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tag),
		});
		if (!res.ok) {
			throw new Error(`Failed to create tag for container ${containerId}`);
		}
		const data = await res.json();
		return Tag.parse(data);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const deleteTagRequest = async (containerId: EntityId, tag: Tag): Promise<void> => {
	try {
		const res = await fetch(`/api/containers/${containerId}/tags/${tag.id}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			throw new Error(`Failed to delete tag for container ${containerId}`);
		}
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const getTagsStore = (
	containerId: EntityId,
	forceReload: boolean = false,
): Writable<Tag[]> => {
	let needsLoad = forceReload;

	if (!tagsPerContainer[containerId]) {
		tagsPerContainer[containerId] = writable<Tag[]>([]);
		needsLoad = true;
	}
	if (needsLoad) {
		loadTags(containerId)
			.then((tags) => {
				tagsPerContainer[containerId].set(tags);
			})
			.catch((err) => {
				console.error(err);
			});
	}
	return tagsPerContainer[containerId];
};

export const addTag = async (
	containerId: EntityId,
	store: Writable<Tag[]>,
	tag: Tag,
): Promise<Tag> => {
	console.log("Triggering tag create....");

	const newTag = await createTagRequest(containerId, tag);
	store.update((tags) => [...tags, newTag]);
	return newTag;
};

export const deleteTag = async (containerId: EntityId, store: Writable<Tag[]>, tag: Tag) => {
	store.update((tags) => tags.filter((t) => t.id !== tag.id));
	console.log("Triggering tag delete....");
	await deleteTagRequest(containerId, tag);
};
