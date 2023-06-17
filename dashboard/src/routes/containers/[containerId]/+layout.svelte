<script lang="ts">
	import { setContext } from "svelte";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	if (data.container) {
		setContext("currentContainer", data.container);
	}
</script>

<slot />
