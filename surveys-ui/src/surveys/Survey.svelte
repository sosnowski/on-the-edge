<script lang="ts">
	import SurveyForm from "surveys/form/SurveyForm.svelte";
	import type { SurveyInfo } from "shared/models/survey";
	import { postResponse } from "../loader";

	export let survey: SurveyInfo;
	export let userToken: string;
	export let sessionToken: string;

	let page = 0;

	const onFormSubmit = (event: CustomEvent<unknown>) => {
		console.log("Form submitted");
		console.log(event.detail);

		page++;

		postResponse(survey.id, userToken, sessionToken, event.detail);
	};
</script>

{#if page < survey.questions.length}
	<SurveyForm {survey} {page} on:submit={onFormSubmit} />
{:else}
	<div class="text-center p-4">
		<h2 class="text-lg text-fuchsia-500">Thank you for your response!</h2>
	</div>
{/if}
