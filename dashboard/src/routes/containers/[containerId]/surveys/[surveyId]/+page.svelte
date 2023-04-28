<script lang="ts">
	import SurveyCreator from "$lib/creator/SurveyCreator.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<SurveyCreator survey={data.survey} />
