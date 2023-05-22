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

	let displayType = survey.displayType;

	const displayTypes = [
		{
			name: "Floating Action Button",
			value: "fab",
			description: "A small floating button that opens the survey when clicked.",
		},
		{
			name: "Modal Popup",
			value: "modal",
			description: "Survey is displayed as popup over the page content.",
		},
		{
			name: "Toast Panel",
			value: "toast",
			description: "Survey is displayed as a floating panel at the bottom of the page.",
		},
	];

	const onDisplayTypeSelect = (type: string) => {
		displayType = type as SurveyDisplayType;
	};

	const onSubmit = (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log(Object.fromEntries(data.entries()));

		const result: Partial<SurveyInfo> = {
			name: data.get("name") as string,
			displayType: data.get("displayType") as SurveyDisplayType,
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

		<label for="displayType" class="block w-full leading-6 text-slate-700 mt-4">Survey type</label>
		<!-- <select
			name="displayType"
			id="displayType"
			class="field-std block w-full"
			bind:value={displayType}
		>
			<option value="fab">Floating Action Button</option>
			<option value="modal">Modal Popup</option>
			<option value="toast">Toast panel</option>
		</select> -->

		<input type="hidden" name="displayType" bind:value={displayType} />

		<div class="grid grid-cols-2 gap-2">
			{#each displayTypes as type}
				<button
					type="button"
					on:click|preventDefault={() => onDisplayTypeSelect(type.value)}
					class="relative grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-1 justify-items-start rounded-md bg-white p-4 shadow-md border hover:border-fuchsia-500"
					class:border-fuchsia-500={displayType === type.value}
					class:border-slate-200={displayType !== type.value}
				>
					<span class="col-start-1 row-start-1">{type.name}</span>
					<span class="col-start-1 col-span-2 row-start-2 text-slate-500 text-sm text-left"
						>{type.description}</span
					>
					<i
						class:invisible={displayType !== type.value}
						class="col-start-2 row-start-1 fa-solid fa-check text-lg leading-4 text-fuchsia-500"
					/>
				</button>
			{/each}
		</div>

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
