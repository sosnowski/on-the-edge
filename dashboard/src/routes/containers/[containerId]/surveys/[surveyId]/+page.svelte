<script lang="ts">
	import SurveyCreator from "$lib/creator/SurveyCreator.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

{#if data.survey}
	<SurveyCreator survey={data.survey} />
{/if}
