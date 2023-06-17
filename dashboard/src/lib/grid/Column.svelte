<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { CellAction, Column, GridAction } from "./grid";

	export let column: Column;
	export let record: Record<string, any>;
	export let index: number;

	const dispatch = createEventDispatcher<{
		action: GridAction;
	}>();

	$: value = column.get(record, index);

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

<td class="border border-slate-100 p-3 text-sm relative"
	><slot {column} {record} {value} {onCellAction} /></td
>
