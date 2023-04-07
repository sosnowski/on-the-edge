<script lang="ts">
	import { type TableSource, Table, tableMapperValues } from "@skeletonlabs/skeleton";
	import type { Container } from "shared/models/base/container";
	import { createEventDispatcher } from "svelte";

	export let containers: Container[];
	const dispatch = createEventDispatcher<{
		add: void;
	}>();

	const tableSimple: TableSource = {
	// A list of heading labels.
		head: ['Name', 'Description', 'Created'],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(containers, ['name', 'description', 'created']),
		// Optional: The data returned when interactive is enabled and a row is clicked.
		meta: tableMapperValues(containers, ['id', 'name', 'description', 'created']),
		// Optional: A list of footer labels.
	};

	const onRowSelected = (e) => {
		console.log('On Row selected');
		console.log(e.detail);
	}
</script>

<Table class="p-8" source={tableSimple} interactive on:selected={onRowSelected}/>