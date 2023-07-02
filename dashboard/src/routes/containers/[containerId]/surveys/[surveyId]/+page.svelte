<script lang="ts">
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<FloatingHeader breadCrumbs={[{ name: "Dashboard" }]} />
<div class="flex-1 grid grid-cols-3 grid-rows-3 flex-wrap gap-2 px-4">
	<div class="panel-std">Number of responses</div>
	<div class="panel-std col-span-2">Linear chart of responses over time</div>
	<div class="panel-std">Surveys Displayed vs Responses vs Finished</div>
	<div class="panel-std">Conversion rate</div>
	<div class="panel-std">Finish rate</div>
	<div class="panel-std col-span-3">Last responses</div>
</div>
