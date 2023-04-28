<script lang="ts">
	import SurveyForm from "surveys/form/SurveyForm.svelte";
	import type { SurveyInfo } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let survey: SurveyInfo;
	export let page: number;

	const dispatch = createEventDispatcher<{
		add: void;
		edit: void;
		page: number;
		delete: void;
	}>();

	const onFormSubmit = (event: CustomEvent<unknown>) => {
		console.log("Form submitted");
		console.log(event.detail);
	};

	const onPrevPage = () => {
		if (page > 0) {
			dispatch("page", page - 1);
		}
	};

	const onNextPage = () => {
		if (page < survey.questions.length - 1) {
			dispatch("page", page + 1);
		}
	};

	$: {
		console.log("PAGE " + page);
	}
</script>

<div class="absolute inset-0 overflow-hidden flex justify-center items-center">
	<div class="grid grid-cols-[auto_1fr_auto_auto] grid-rows-[1fr_auto] w-full max-w-2xl gap-4">
		<div
			class="col-start-2 row-start-1 overflow-hidden rounded-lg bg-white text-left shadow-lg transition-all"
		>
			{#if survey.questions.length > 0}
				<SurveyForm {survey} {page} on:submit={onFormSubmit} />
			{:else}
				<div class="text-center p-4">
					<h2 class="text-lg text-fuchsia-500">No questions yet</h2>
					<p class="text-slate-500">Click the add button to create a new question</p>
				</div>
			{/if}
		</div>

		<div class="col-start-1 row-start-1 w-10 h-full flex justify-center items-center">
			<button
				title="Previous question"
				on:click={onPrevPage}
				disabled={page === 0}
				class="bg-white text-2xl text-fuchsia-500 rounded-md shadow-md p-4 opacity-90 hover:opacity-100 disabled:opacity-20"
			>
				<i class="fa-solid fa-chevron-left" />
			</button>
		</div>

		<div class="col-start-4 row-start-1 w-10 h-full flex justify-center items-center">
			<button
				title="Next question"
				on:click={onNextPage}
				disabled={page >= survey.questions.length - 1}
				class="bg-white text-2xl text-fuchsia-500 rounded-md shadow-md p-4 opacity-90 hover:opacity-100 disabled:opacity-20"
			>
				<i class="fa-solid fa-chevron-right" />
			</button>
		</div>

		<div class="col-start-3 row-start-1 w-10 h-full flex justify-center items-center">
			<button
				on:click={() => {
					dispatch("add");
				}}
				title="Add a new question"
				class="bg-white text-2xl text-fuchsia-500 rounded-md shadow-md p-4 opacity-90 hover:opacity-100"
			>
				<i class="fa-solid fa-plus" />
			</button>
		</div>
		<div class="col-start-2 row-start-2 w-full h-10 flex justify-center items-center gap-2">
			<button
				on:click={() => dispatch("edit")}
				title="Edit the question"
				class="btn-std w-10 h-10 flex justify-center items-center disabled:opacity-20 disabled:cursor-default"
				disabled={survey.questions.length === 0}><i class="fa-solid fa-pen" /></button
			>
			<button
				on:click={() => dispatch("delete")}
				title="Delete the question"
				class="btn-std w-10 h-10 flex justify-center items-center disabled:opacity-20 disabled:cursor-default"
				disabled={survey.questions.length === 0}><i class="fa-regular fa-trash-can" /></button
			>
		</div>
	</div>
</div>
