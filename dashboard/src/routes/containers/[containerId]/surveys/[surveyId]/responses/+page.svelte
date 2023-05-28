<script lang="ts">
	import ActionsCell from "$lib/grid/ActionsCell.svelte";
	import Grid from "$lib/grid/Grid.svelte";
	import ResponseCell from "$lib/grid/ResponseCell.svelte";
	import type { Column, GridAction } from "$lib/grid/grid";
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";

	const page = 1;
	const pageSize = 10;

	let records: Record<string, unknown>[] = [];

	for (let i = 1; i <= pageSize; i++) {
		records.push({
			id: i * page,
			name: `Record ${i * page}`,
		});
	}

	const columns: Column[] = [
		{
			label: "Name",
			field: "name",
		},
		{
			label: "Tags",
			field: "name",
			cmp: ResponseCell,
		},
		{
			label: "Actions",
			field: "name",
			cmp: ActionsCell,
		},
	];

	const onGridAction = (event: CustomEvent<GridAction>) => {
		console.log("Grid On Action", event.detail);
	};
</script>

<FloatingHeader
	breadCrumbs={[
		{ name: "Containers", href: "/containers" },
		{ name: "Some container", href: "/" },
		{ name: "Some survey", href: "/" },
		{ name: "Responses" },
	]}
/>

<h1 class="m-4 text-2xl text-slate-600">Responses</h1>

<div class="mx-4 bg-white rounded-md shadow-md flex-1">
	<Grid {columns} data={records} keyField="id" allRecords={75} {page} {pageSize} />
</div>
