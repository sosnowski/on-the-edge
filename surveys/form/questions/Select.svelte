<script lang="ts">
	import { SelectQuestion, SurveyQuestion } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let question: SelectQuestion;

	const dispatch = createEventDispatcher<{
		submit: string;
	}>();

	const onSubmit = (e: SubmitEvent) => {
		const data = new FormData(e.target as HTMLFormElement);

		dispatch("submit", data.get("response") as string);
		(e.target as HTMLFormElement).reset();
	};

	const onSelect = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		console.log("target", target.value);

		dispatch("submit", target.value);
		target.value = "";
	};
</script>

<div class="flex flex-col gap-4 w-full h-full justify-start items-center">
	<p class="text-center text-slate-800 text-lg">{question.label}</p>

	<form class="contents">
		<select
			class="w-full rounded-md border-0 p-2 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-fuchsia-600 leading-6"
			name="response"
			on:change={onSelect}
		>
			<option value="" disabled selected>Select an option</option>
			{#each question.options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</form>
</div>
