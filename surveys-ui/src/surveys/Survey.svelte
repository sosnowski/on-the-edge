<script lang="ts">
	import SurveyForm from "surveys/form/SurveyForm.svelte";
	import type { SurveyInfo } from "shared/models/survey";

	export let survey: SurveyInfo;

	let page = 0;

	const onFormSubmit = (event: CustomEvent<unknown>) => {
		console.log("Form submitted");
		console.log(event.detail);
	};
</script>

{#if survey.questions.length > 0}
	<SurveyForm {survey} {page} on:submit={onFormSubmit} />
{:else}
	<div class="text-center p-4">
		<h2 class="text-lg text-fuchsia-500">No questions yet</h2>
	</div>
{/if}
