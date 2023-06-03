<script lang="ts">
	import { goto } from "$app/navigation";
	import Grid from "$lib/grid/Grid.svelte";
	import TextCell from "$lib/grid/TextCell.svelte";
	import type { Column, GridAction } from "$lib/grid/grid";
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import type { SurveyResponsesDetails } from "shared/models/response";
	import type { PageData } from "./$types";
	import { formatDate } from "$lib/helpers";
	import RatingCell from "$lib/grid/RatingCell.svelte";
	import ActionsCell from "$lib/grid/ActionsCell.svelte";

	export let data: PageData;

	$: page = data.page!;
	$: pageSize = data.pageSize!;
	$: countAll = data.countAll!;
	$: surveyInfo = data.survey!;
	$: records = data.responses as Record<string, unknown>[];

	$: columns = [
		{
			label: "#",
			get: (_, index) => `${(page - 1) * pageSize + index + 1}.`,
			id: "index",
		},
		{
			label: "Received",
			get: (row) => formatDate(row.lastResponded),
			id: "received",
		},
		...(data.survey?.questions.map((question): Column<SurveyResponsesDetails> => {
			return {
				label: question.label,
				get: (row) => {
					if (question.type === "select") {
						const optionValue = row.responses[question.id!]?.content;
						if (optionValue) {
							return question.options.find((option) => option.value === optionValue)?.label || "-";
						}
						return "-";
					}
					return row.responses[question.id!]?.content || "-";
				},
				cmp: question.type === "rating" ? RatingCell : TextCell,
				id: question.id!,
			};
		}) || []),
		{
			label: "Actions",
			get: (row) => row,
			cmp: ActionsCell,
			id: "actions",
		},
	];

	const onGridAction = (event: CustomEvent<GridAction<SurveyResponsesDetails>>) => {
		console.log("Grid On Action", event.detail);
	};

	const changePage = (event: CustomEvent<number>) => {
		console.log("Change page", event.detail);
		const url = new URL(window.location.href);
		url.searchParams.set("page", event.detail.toString());
		goto(url.toString(), { noScroll: true });
	};
</script>

<FloatingHeader
	breadCrumbs={[
		{ name: surveyInfo.containerName || "", href: `/containers/${surveyInfo.containerId}/surveys` },
		{
			name: surveyInfo.name,
			href: `/containers/${surveyInfo.containerId}/surveys/${surveyInfo.id}`,
		},
		{ name: "Responses" },
	]}
/>

<h1 class="m-4 text-2xl text-slate-600">Responses</h1>

<div class="mx-4 bg-white rounded-md shadow-md flex-1">
	<Grid
		{columns}
		data={records}
		keyField="instanceId"
		allRecords={countAll || 0}
		{page}
		{pageSize}
		on:page={changePage}
	/>
</div>
