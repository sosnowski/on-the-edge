<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	import type { CellAction, Column } from "./grid";
	import type { Tag, ResponsesDetailsByInstance } from "shared/models/response";
	import type { SurveyQuestion } from "shared/models/survey";
	import Tags from "$lib/responses/Tags.svelte";
	import type { Container } from "shared/models/container";
	import { getTagsStore } from "$lib/responses/tags_store";

	export let column: Column<ResponsesDetailsByInstance, Record<string, SurveyQuestion>>;
	export let record: Record<string, any>;
	export let value: unknown;

	if (!column.data || !column.data.question) throw new Error("No column data provided");

	$: tagsIds =
		(record as ResponsesDetailsByInstance).responses[column.data!.question.id!]?.tags || [];

	const currentContainer: Container | undefined = getContext("currentContainer");
	const allTags = getTagsStore(currentContainer!.id!);

	$: tags = $allTags.filter((tag) => tagsIds.includes(tag.id!));

	const dispatch = createEventDispatcher<{
		action: CellAction;
	}>();

	const onTagsUpdate = (event: CustomEvent<Tag[]>) => {
		dispatch("action", {
			name: "tags:update",
			detail: {
				question: column.data!.question,
				tags: event.detail,
			},
		});
	};
</script>

<p class="text-slate-600">{value}</p>
{#if currentContainer?.id}
	<Tags selectedTags={tags} containerId={currentContainer.id} on:update={onTagsUpdate} />
{/if}
