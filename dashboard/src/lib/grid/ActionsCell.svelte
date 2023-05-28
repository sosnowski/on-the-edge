<script lang="ts">
	import type { Column } from "./grid";

	export let column: Column;
	export let record: Record<string, any>;
	export let value: unknown;
</script>

<div class="flex flex-row gap-2 w-full h-full justify-center items-center">
	<button class="btn-std">
		<i class="fa-regular fa-trash-can" />
	</button>
</div>
