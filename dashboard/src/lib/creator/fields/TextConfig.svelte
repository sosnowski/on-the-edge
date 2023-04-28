<script lang="ts">
	import { newEntityId } from "shared/models/base";
	import type { SurveyQuestion, TextQuestion } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let question: SurveyQuestion | undefined = undefined;
	const dispatch = createEventDispatcher<{ save: TextQuestion }>();

	let label = question?.label || "";

	const onSubmit = (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log({
			type: "rating",
			label: data.get("label") as string,
		});

		dispatch("save", {
			id: question?.id || newEntityId(),
			type: "text",
			label: data.get("label") as string,
		});
	};
</script>

<div class="flex flex-col gap-2 h-full">
	<form method="post" class="contents" on:submit|preventDefault={onSubmit}>
		<label for="label" class="block w-full leading-6 text-slate-700">Question</label>
		<textarea
			name="label"
			id="label"
			required
			class="field-std block w-full"
			placeholder="How do you rate your experience?"
			bind:value={label}
			maxlength="200"
		/>
		<p class="text-sm text-slate-600 text-right">{label.length}/200</p>

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
