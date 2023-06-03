<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { CellAction, Column } from "./grid";

	export let column: Column;
	export let record: Record<string, any>;
	export let value: unknown;

	const dispatch = createEventDispatcher<{
		action: CellAction;
	}>();
</script>

<p class="text-right">{value}</p>
