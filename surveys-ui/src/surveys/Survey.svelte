<script lang="ts">
	import { onMount } from "svelte";
	import SurveyForm from "surveys/form/SurveyForm.svelte";
	import type { SurveyInfo } from "shared/models/survey";
	import { postImpression, postResponse } from "../loader";

	export let survey: SurveyInfo;
	export let userToken: string;

	let page = 0;

	//TODO some better instanceId generator
	// instance is used to group responses sent for the same survey instance
	const instanceId = Math.random().toString(36).substring(2, 15);

	onMount(async () => {
		console.log("Survey mounted");
		await postImpression(userToken, survey.id);
	});

	const onFormSubmit = async (event: CustomEvent<unknown>) => {
		console.log("Form submitted");
		console.log(event.detail);

		page++;

		await postResponse(userToken, survey.id, instanceId, event.detail);
	};
</script>

{#if page < survey.questions.length}
	<SurveyForm {survey} {page} on:submit={onFormSubmit} />
{:else}
	<div class="text-center p-4">
		<h2 class="text-lg text-fuchsia-500">Thank you for your response!</h2>
	</div>
{/if}
