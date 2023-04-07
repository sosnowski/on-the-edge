<script lang="ts">
	import type { PageData } from "./$types";
	import { type TableSource, Table, tableMapperValues } from "@skeletonlabs/skeleton";

	export let data: PageData;

	const tableSimple: TableSource = {
	// A list of heading labels.
		head: ['Name', 'Type', 'Display', 'Status', 'Trigger Type'],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(data.surveys, ['name', 'type', 'display', 'status', 'triggerConfig.type']),
		// Optional: The data returned when interactive is enabled and a row is clicked.
		meta: tableMapperValues(data.surveys, ['id', 'name', 'type', 'display', 'status', 'triggerConfig.type']),
		// Optional: A list of footer labels.
	};

	const onRowSelected = (e: CustomEvent) => {
		console.log('On Survey Row selected');
		console.log(e.detail);
	}
</script>

<Table class="p-8" source={tableSimple} interactive on:selected={onRowSelected}/>