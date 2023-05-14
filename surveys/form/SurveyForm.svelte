<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { SurveyQuestion, SurveyInfo } from "shared/models/survey";
	import type { SurveyResponse } from "shared/models/response";

	import RatingField from "./questions/Rating.svelte";
	import TextField from "./questions/Text.svelte";
	import SelectField from "./questions/Select.svelte";

	export let survey: SurveyInfo;
	export let page: number;

	const dispatch = createEventDispatcher<{
		submit: SurveyResponse;
	}>();

	const getCmp = (question: SurveyQuestion) => {
		switch (question.type) {
			case "rating":
				return RatingField;
			case "text":
				return TextField;
			case "select":
				return SelectField;
			default:
				return null;
		}
	};

	$: currentQuestion = survey.questions[page] || null;
	$: currentQuestionCmp = getCmp(currentQuestion);

	$: {
		console.log("CURRENT SURVEY FIELD");
		console.log(currentQuestion);
	}

	const onQuestionSubmit = (question: SurveyQuestion, event: CustomEvent) => {
		dispatch("submit", {
			questionId: question.id,
			content: event.detail,
		});
	};
</script>

<div class="w-full flex flex-col justify-center items-center p-6">
	{#if currentQuestion}
		<svelte:component
			this={currentQuestionCmp}
			question={currentQuestion}
			on:submit={(event) => onQuestionSubmit(currentQuestion, event)}
		/>
	{/if}
</div>
