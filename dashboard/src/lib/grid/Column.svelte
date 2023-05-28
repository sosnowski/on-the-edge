<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { CellAction, Column, GridAction } from "./grid";

	export let column: Column;
	export let record: Record<string, any>;

	const dispatch = createEventDispatcher<{
		action: GridAction;
	}>();

	$: value = record[column.field];

	const onCellAction = (event: CustomEvent<CellAction>) => {
		console.log("Column on Cell Action!", event.detail);
		dispatch("action", {
			name: event.detail.name,
			detail: event.detail.detail,
			column,
			record,
		});
	};
</script>

<td class="border border-slate-100 px-4 py-2 text-sm"
	><slot {column} {record} {value} {onCellAction} /></td
>
