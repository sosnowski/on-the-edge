<script lang="ts">
	import type { EntityId, Tag } from "shared/models/response";
	import TagCmp from "$lib/responses/Tag.svelte";
	import { fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
	import { addTag, deleteTag, getTagsStore } from "./tags_store";

	export let containerId: EntityId;
	export let selectedTags: Tag[] = [];

	let tagsStore = getTagsStore(containerId);

	const dispatch = createEventDispatcher<{
		save: Tag[];
		create: Tag;
	}>();

	const colors = [
		{
			id: "red",
			bg: "bg-red-200 text-red-600 hover:bg-red-400",
		},
		{
			id: "gray",
			bg: "bg-gray-200 text-gray-600 hover:bg-gray-400",
		},
		{
			id: "green",
			bg: "bg-green-200 text-green-600 hover:bg-green-400",
		},
		{
			id: "blue",
			bg: "bg-blue-200 text-blue-600 hover:bg-blue-400",
		},
		{
			id: "indigo",
			bg: "bg-indigo-200 text-indigo-600 hover:bg-indigo-400",
		},
		{
			id: "purple",
			bg: "bg-purple-200 text-purple-600 hover:bg-purple-400",
		},
		{
			id: "orange",
			bg: "bg-orange-200 text-orange-600 hover:bg-orange-400",
		},
		{
			id: "fuchsia",
			bg: "bg-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-400",
		},
		{
			id: "yellow",
			bg: "bg-yellow-200 text-yellow-600 hover:bg-yellow-400",
		},
	];

	let selectedColor = colors[Math.floor(Math.random() * colors.length)];

	$: availableTags = $tagsStore.filter((tag) => !selectedTags.find((t) => t.id === tag.id));

	let showColorPicker = false;

	const toggleColorPicker = () => {
		showColorPicker = !showColorPicker;
	};

	const onColorSelect = (color: { id: string; bg: string }) => {
		selectedColor = color;
		toggleColorPicker();
	};

	const onTagSelect = (tag: Tag) => {
		selectedTags = [...selectedTags, tag];
	};

	const onTagDeselect = (tag: Tag) => {
		selectedTags = selectedTags.filter((t) => t.id !== tag.id);
	};

	const onTagDelete = (tag: Tag) => {
		onTagDeselect(tag);
		deleteTag(containerId, tagsStore, tag);
	};

	const onTagsSave = () => {
		dispatch("save", selectedTags);
	};

	const onNewSubmit = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const label = formData.get("label") as string;
		const color = selectedColor.id;
		const tag: Tag = {
			label,
			color,
		};
		form.reset();
		const newTag = await addTag(containerId, tagsStore, tag);
		onTagSelect(newTag);
	};
</script>

<div
	transition:fade
	class="absolute flex flex-col my-2 p-2 top-full right-0 bg-white border border-slate-100 rounded-md shadow-md z-20 w-96"
>
	<p class="my-2">Selected tags</p>

	<div class="flex flex-row flex-wrap gap-2">
		{#each selectedTags as tag}
			<TagCmp {tag} selectMode={true} on:click={() => onTagDeselect(tag)} />
		{:else}
			<p class=" text-slate-400 text-center flex-1">No tags selected.</p>
		{/each}
	</div>
	<p class="my-2">Available tags</p>

	<div class="flex flex-row flex-wrap gap-2">
		{#each availableTags as tag}
			<TagCmp
				{tag}
				selectMode={true}
				editMode={true}
				on:click={() => onTagSelect(tag)}
				on:delete={() => onTagDelete(tag)}
			/>
		{:else}
			<p class=" text-slate-400 text-center flex-1">
				No tags available, use field below to add more.
			</p>
		{/each}
	</div>
	<div class="flex flex-row gap-2 justify-start items-center my-2 pt-2 border-t border-slate-100">
		<form class="contents" on:submit|preventDefault={onNewSubmit}>
			<input
				type="text"
				name="label"
				required
				placeholder="Label"
				class="field-std text-xs flex-1"
			/>
			<div class="relative">
				<button
					on:click={toggleColorPicker}
					type="button"
					class={`rounded-md py-1 px-4 border border-slate-300 w-7 h-7 ${selectedColor.bg} inline-flex items-center justify-center`}
					><i class="fa-solid fa-eye-dropper" /></button
				>
				{#if showColorPicker}
					<div
						class="absolute grid grid-cols-[auto_auto_auto] gap-2 mt-1 p-2 left-0 bg-white border border-slate-100 rounded-md shadow-md z-20"
					>
						{#each colors as color}
							<button
								on:click={() => onColorSelect(color)}
								type="button"
								class={`rounded-md py-1 px-4 border border-slate-300 w-8 h-8 ${color.bg}`}
							/>
						{/each}
					</div>
				{/if}
			</div>

			<button class="btn-std text-xs h-7">New tag</button>
		</form>
	</div>
	<button on:click={onTagsSave} class="btn-primary text-xs self-center">Save</button>
</div>
