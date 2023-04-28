<script lang="ts">
	import { nanoid } from "nanoid";
	import type { RatingQuestion, SurveyQuestion } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let question: SurveyQuestion | undefined = undefined;
	const dispatch = createEventDispatcher<{ save: RatingQuestion }>();

	const onSubmit = (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log({
			type: "rating",
			label: data.get("label") as string,
		});

		dispatch("save", {
			id: question?.id || nanoid(30),
			type: "rating",
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
			value={question?.label || ""}
		/>

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
