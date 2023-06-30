<script lang="ts">
	import { fade } from "svelte/transition";
	import TagCmp from "$lib/responses/Tag.svelte";
	import { getTagsStore } from "$lib/responses/tags_store";
	import { createEventDispatcher, getContext } from "svelte";
	import type { Container } from "shared/models/container";
	import { formatDate, formatDateTime, formatDateToInput } from "$lib/helpers";
	import type { ResponsesFilters, Tag } from "shared/models/response";

	export let activeFilters: ResponsesFilters = {
		receivedFrom: undefined,
		receivedTo: undefined,
		tags: [],
	};

	const dispatch = createEventDispatcher<{
		update: ResponsesFilters;
	}>();

	const currentContainer: Container = getContext("currentContainer");

	let showFiltersList = false;
	let showTagsList = false;

	const tagsStore = getTagsStore(currentContainer.id!);

	$: selectedTags = $tagsStore.filter((tag) => activeFilters.tags?.includes(tag.id!));
	$: availableTags = $tagsStore.filter((tag) => !selectedTags.includes(tag));
	$: activeTags = (activeFilters.tags || [])
		.map((tagId) => $tagsStore.find((tag) => tag.id === tagId)!)
		.filter((tag) => !!tag);
	$: fromDate = activeFilters.receivedFrom ? formatDateToInput(activeFilters.receivedFrom) : "";
	$: toDate = activeFilters.receivedTo ? formatDateToInput(activeFilters.receivedTo) : "";
	$: filtersApplied =
		activeFilters.receivedFrom ||
		activeFilters.receivedTo ||
		(activeFilters.tags && activeFilters.tags.length > 0);

	const clearDates = () => {
		fromDate = "";
		toDate = "";
	};

	const clearFilters = () => {
		dispatch("update", {
			receivedFrom: undefined,
			receivedTo: undefined,
			tags: [],
		});
		showFiltersList = false;
	};

	const deselectTag = (tag: Tag) => {
		selectedTags = selectedTags.filter((t) => t.id !== tag.id);
	};

	const selectTag = (tag: Tag) => {
		selectedTags = [...selectedTags, tag];
	};

	const toggleFiltersList = () => {
		showFiltersList = !showFiltersList;
		if (!showFiltersList) {
			showTagsList = false;
		}
	};

	const toggleTagsList = () => {
		showTagsList = !showTagsList;
	};

	const onSubmit = (e: SubmitEvent) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const receivedFrom = formData.get("receivedFrom") as string;
		const receivedTo = formData.get("receivedTo") as string;
		const tags = selectedTags.map((tag) => tag.id!);
		const newFilters: ResponsesFilters = {
			receivedFrom: receivedFrom ? new Date(receivedFrom) : undefined,
			receivedTo: receivedTo ? new Date(receivedTo) : undefined,
			tags,
		};
		if (newFilters.receivedTo) {
			newFilters.receivedTo.setHours(23, 59, 59, 999);
		}
		dispatch("update", newFilters);
		toggleFiltersList();
	};
</script>

<div class="flex flex-row relative items-center justify-end gap-2">
	{#if activeFilters.receivedFrom || activeFilters.receivedTo}
		<div class="flex flex-row items-center gap-1">
			<p class="text-slate-500 text-sm">By Received Date:</p>
			{#if activeFilters.receivedFrom}
				<span
					class="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-mediumtext-slate-500 ring-1 ring-inset ring-slate-300"
				>
					from <strong class="font-medium">{formatDate(activeFilters.receivedFrom)}</strong>
				</span>
			{/if}
			{#if activeFilters.receivedTo}
				<span
					class="inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-mediumtext-slate-500 ring-1 ring-inset ring-slate-300"
				>
					to <strong class="font-medium">{formatDate(activeFilters.receivedTo)}</strong>
				</span>
			{/if}
		</div>
	{/if}
	{#if activeTags.length > 0}
		<div class="flex flex-row items-center gap-1">
			<p class="text-slate-500 text-sm">By Tags:</p>
			{#each activeTags as tag}
				<TagCmp {tag} />
			{:else}
				<p class="text-slate-500 text-sm">No tags selected</p>
			{/each}
		</div>
	{/if}
	<button on:click={toggleFiltersList} type="button" class="btn-primary"
		><i class="fa-solid fa-filter" /> Filters</button
	>
	{#if filtersApplied}
		<button type="button" on:click={clearFilters} class="btn-std"
			><i class="fa-solid fa-xmark" /> Clear</button
		>
	{/if}
	{#if showFiltersList}
		<div
			transition:fade
			class="absolute top-full mt-0.5 right-0 bg-white shadow-md rounded-md border border-slate-100 flex flex-col gap-2 p-4 text-sm z-20 max-w-md"
		>
			<form class="contents" on:submit|preventDefault={onSubmit}>
				<div class="grid grid-rows-2 grid-cols-[auto_auto_auto_auto] gap-1 items-center">
					<p class="col-start-1 col-span-2 row-start-1">By Received Date:</p>
					<input
						class="field-std text-sm px-2 col-start-1 row-start-2"
						type="date"
						name="receivedFrom"
						placeholder="Date from"
						value={fromDate}
					/>
					<span class="text-slate-500 col-start-2 row-start-2">-</span>
					<input
						class="field-std text-sm px-2 col-start-3 row-start-2"
						type="date"
						name="receivedTo"
						placeholder="Date to"
						value={toDate}
					/>
					<button
						on:click={clearDates}
						type="button"
						class="col-start-4 row-start-2 px-2 hover:text-slate-500"
						><i class="fa-solid fa-xmark" /></button
					>
				</div>

				<div class="flex flex-col gap-1">
					<p class="col-start-1 col-span-2 row-start-1">By Tags:</p>
					<div class="flex flex-row flex-wrap items-center justify-start gap-1 relative">
						{#each selectedTags as tag}
							<TagCmp {tag} editMode={true} on:delete={() => deselectTag(tag)} />
						{:else}
							<p class="text-slate-500 text-sm">No tags selected</p>
						{/each}
						<button type="button" on:click={toggleTagsList} class="btn-std w-7 h-7 p-0 ml-auto"
							><i class="fa-solid fa-plus" /></button
						>
						{#if showTagsList}
							<div
								class="absolute top-full right-0 mt-0.5 bg-white shadow-md rounded-md border border-slate-100 flex flex-row flex-wrap gap-2 p-4 items-start justify-start w-64"
							>
								<p class="w-full">Select tag to filter</p>
								{#each availableTags as tag}
									<TagCmp
										selectMode={true}
										{tag}
										on:click={() => {
											selectTag(tag);
										}}
									/>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div class="flex flex-row gap-2 my-2">
					<button class="btn-std" type="button" on:click={clearFilters}>Clear</button>

					<button class="btn-primary ml-auto" type="submit">Apply</button>
					<button class="btn-std" type="button" on:click={toggleFiltersList}>Close</button>
				</div>
			</form>
		</div>
	{/if}
</div>
