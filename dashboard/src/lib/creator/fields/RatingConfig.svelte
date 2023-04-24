<script lang="ts">
	import type { RatingField, SurveyField } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let field: SurveyField | undefined = undefined;
	const dispatch = createEventDispatcher<{ save: RatingField }>();

	const onSubmit = (e: Event) => {
		e.preventDefault();
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log({
			type: "rating",
			label: data.get("label") as string,
			autoSubmit: true,
		});

		dispatch("save", {
			type: "rating",
			label: data.get("label") as string,
			autoSubmit: true,
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
			value={field?.label || ""}
		/>

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
