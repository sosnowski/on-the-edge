<script lang="ts">
	import type { Column } from "./grid";

	export let column: Column;
	export let record: Record<string, any>;
	export let value: unknown;
</script>

<span>{value}</span>
