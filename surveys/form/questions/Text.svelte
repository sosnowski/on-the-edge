<script lang="ts">
	import { SurveyQuestion } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let question: SurveyQuestion;

	const dispatch = createEventDispatcher<{
		submit: string;
	}>();

	const onSubmit = (e: SubmitEvent) => {
		const data = new FormData(e.target as HTMLFormElement);

		dispatch("submit", data.get("response") as string);
		(e.target as HTMLFormElement).reset();
	};
</script>

<div class="flex flex-col gap-4 w-full h-full justify-start items-center">
	<p class="text-center text-slate-800 text-lg">{question.label}</p>

	<form class="contents" on:submit|preventDefault={onSubmit}>
		<textarea
			class="w-full h-28 border-0 rounded-md p-2 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-fuchsia-600 leading-6"
			placeholder="Enter your response here"
			name="response"
		/>
		<button
			type="submit"
			class=" w-1/3 text-sm inline-block bg-fuchsia-500 text-white border border-fuchsia-200 rounded-md py-1 px-4 shadow-md hover:bg-fuchsia-300 hover:border-fuchsia-300 cursor-pointer"
			>Submit</button
		>
	</form>
</div>
