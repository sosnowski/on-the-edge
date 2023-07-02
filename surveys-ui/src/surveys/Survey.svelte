<script lang="ts">
	import { onMount } from "svelte";
	import SurveyForm from "surveys/form/SurveyForm.svelte";
	import type { SurveyInfo } from "shared/models/survey";
	import {
		postCompletedEvent,
		postDisplayedEvent,
		postRespondedEvent,
		postResponse,
	} from "../loader";
	import type { SurveyResponse } from "shared/models/response";

	export let survey: SurveyInfo;
	export let userToken: string;

	let page = 0;

	//TODO some better instanceId generator
	// instance is used to group responses sent for the same survey instance
	const instanceId = Math.random().toString(36).substring(2, 15);

	onMount(async () => {
		console.log("POST SURVEY DISPLAYED EVENT");
		await postDisplayedEvent(userToken, survey.id, instanceId);
	});

	const onFormSubmit = async (event: CustomEvent<SurveyResponse>) => {
		console.log("Form submitted");
		console.log(event.detail);

		page++;

		console.log("POST RESPONDED EVENT ", event.detail);
		await Promise.all([
			postResponse(userToken, survey.id, instanceId, event.detail),
			postRespondedEvent(userToken, survey.id, instanceId, event.detail),
		]);

		if (page >= survey.questions.length) {
			console.log("POST SURVEY COMPLETED EVENT");
			await postCompletedEvent(userToken, survey.id, instanceId);
		}
	};
</script>

{#if page < survey.questions.length}
	<SurveyForm {survey} {page} on:submit={onFormSubmit} />
{:else}
	<div class="text-center p-4">
		<h2 class="text-lg text-fuchsia-500">Thank you for your response!</h2>
	</div>
{/if}
