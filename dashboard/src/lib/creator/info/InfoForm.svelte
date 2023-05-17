<script lang="ts">
	import type {
		OnClickTrigger,
		OnLoadTrigger,
		SurveyDisplayType,
		SurveyInfo,
		SurveyTrigger,
	} from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let survey: SurveyInfo;
	const dispatch = createEventDispatcher<{
		change: Partial<SurveyInfo>;
	}>();

	const onSubmit = (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log(Object.fromEntries(data.entries()));

		const result: Partial<SurveyInfo> = {
			name: data.get("name") as string,
		};

		console.log("SURVEY CONFIG", result);

		dispatch("change", result);
	};
</script>

<div class="flex flex-col gap-2 h-full">
	<form method="post" class="contents" on:submit|preventDefault={onSubmit}>
		<label for="name" class="block w-full leading-6 text-slate-700">Survey name</label>
		<input
			type="text"
			name="name"
			id="name"
			required
			class="field-std block w-full"
			placeholder="My awesome survey"
			value={survey.name || ""}
		/>

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
