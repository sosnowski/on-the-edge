<script lang="ts">
	import { goto } from "$app/navigation";
	import Grid from "$lib/grid/Grid.svelte";
	import TagsCell from "$lib/grid/TagsCell.svelte";
	import type { Column, GridAction } from "$lib/grid/grid";
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import type { ResponsesDetailsByInstance, Tag } from "shared/models/response";
	import type { PageData } from "./$types";
	import { formatDate } from "$lib/helpers";
	import RatingCell from "$lib/grid/RatingCell.svelte";
	import ActionsCell from "$lib/grid/ActionsCell.svelte";
	import type { SurveyQuestion } from "shared/models/survey";

	export let data: PageData;

	$: page = data.page!;
	$: pageSize = data.pageSize!;
	$: countAll = data.countAll!;
	$: surveyInfo = data.survey!;
	$: records = data.responses!;

	$: {
		console.log(records);
	}

	$: columns = [
		{
			label: "#",
			get: (row, index) => `${(page - 1) * pageSize + index + 1}. ${row.instanceId}`,
			id: "index",
		},
		{
			label: "Received",
			get: (row) => formatDate(row.lastResponded),
			id: "received",
		},
		...(data.survey?.questions.map((question): Column<ResponsesDetailsByInstance> => {
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
				cmp: question.type === "rating" ? RatingCell : TagsCell,
				data: {
					question: question,
				},
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

	const onTagUpdate = async (
		action: GridAction<
			ResponsesDetailsByInstance,
			{
				question: SurveyQuestion;
				tags: Tag[];
			}
		>,
	): Promise<void> => {
		console.log("Tag update", action);

		const { record, detail } = action;
		if (detail) {
			const { question, tags } = detail!;

			// assign tags to proper element in records
			records = records.map((r) => {
				if (r.instanceId === record.instanceId) {
					r.responses[question.id!]!.tags = tags;
				}
				return r;
			});

			const response = record.responses[question.id!];

			const res = await fetch(`/api/surveys/${surveyInfo.id}/responses/${response.id}/tags`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(tags),
			});

			if (!res.ok) {
				console.error("Failed to update tags", res);
			}
			console.log("Tags updated");
		}
	};

	const onGridAction = (event: CustomEvent<GridAction<any, any>>) => {
		console.log("Grid On Action", event.detail);
		if (event.detail.name === "tags:update") {
			onTagUpdate(
				event.detail as GridAction<
					ResponsesDetailsByInstance,
					{
						question: SurveyQuestion;
						tags: Tag[];
					}
				>,
			);
		}
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
		on:action={onGridAction}
	/>
</div>
