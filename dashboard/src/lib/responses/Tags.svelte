<script lang="ts">
	import type { EntityId, Tag } from "shared/models/response";
	import TagCmp from "$lib/responses/Tag.svelte";
	import TagsMenu from "./TagsMenu.svelte";
	import { createEventDispatcher } from "svelte";

	export let selectedTags: Tag[];
	export let containerId: EntityId;

	const dispatch = createEventDispatcher<{
		update: Tag[];
	}>();

	let editMode = false;

	const onTagsSave = (e: CustomEvent<Tag[]>) => {
		editMode = false;
		dispatch("update", e.detail);
	};
</script>

<p class="mt-2 flex flex-row gap-1 flex-wrap relative">
	{#each selectedTags as tag}
		<TagCmp {tag} />
	{/each}
	<button
		on:click={() => (editMode = !editMode)}
		class="ml-auto mt-auto btn-std px-2 py-1 text-xs shadow-none gap-1"
		>{editMode ? "Close" : "Edit"} <i class="fa-solid fa-tags" /></button
	>

	{#if editMode}
		<TagsMenu {selectedTags} {containerId} on:save={onTagsSave} />
	{/if}
</p>
