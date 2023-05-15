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

	let triggerType = survey.triggerConfig.type;
	let displayType = survey.displayType;
	let delay = (survey.triggerConfig as OnLoadTrigger).delay || 0;
	let pageGlob = (survey.triggerConfig as OnLoadTrigger).pageGlob || "";
	let selector = (survey.triggerConfig as OnClickTrigger).selector || "";

	const onSubmit = (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log(Object.fromEntries(data.entries()));

		let triggerConfig: SurveyTrigger;
		switch (data.get("trigger") as string) {
			case "onload":
				triggerConfig = {
					type: "onload",
					delay: +(data.get("delay") || 0),
					pageGlob: (data.get("pageGlob") as string) || undefined,
				};
				break;
			case "onclick":
				triggerConfig = {
					type: "onclick",
					delay: +(data.get("delay") || 0),
					selector: data.get("selector") as string,
				};
				break;
			case "always":
			default:
				triggerConfig = {
					type: "always",
				};
				break;
		}

		const result: Partial<SurveyInfo> = {
			name: data.get("name") as string,
			displayType: data.get("displayType") as SurveyDisplayType,
			triggerConfig: triggerConfig,
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

		<label for="displayType" class="block w-full leading-6 text-slate-700 mt-4">Display Type</label>
		<select
			name="displayType"
			id="displayType"
			class="field-std block w-full"
			bind:value={displayType}
		>
			<option value="fab">Floating Action Button</option>
			<option value="modal">Modal Popup</option>
			<option value="toast">Toast panel</option>
		</select>

		<label for="trigger" class="block w-full leading-6 text-slate-700 mt-4">Trigger type</label>
		<select name="trigger" id="trigger" class="field-std block w-full" bind:value={triggerType}>
			<option value="always">Survey is always displayed</option>
			<option value="onload">Displayed on specific pages</option>
			<option value="onclick">Displayed on click</option>
		</select>

		{#if triggerType === "onload"}
			<fieldset class="contents">
				<legend class="font-bold mt-4">Trigger details</legend>
				<label for="pageGlob" class="block w-full leading-6 text-slate-700 mt-4">Page Regex</label>
				<input
					type="text"
					name="pageGlob"
					id="pageGlob"
					placeholder="/articles/.*"
					class="field-std block w-full"
					bind:value={pageGlob}
				/>
				<label for="delay" class="block w-full leading-6 text-slate-700 mt-4">Delay</label>
				<input
					type="range"
					name="delay"
					id="delay"
					min="0"
					max="10"
					step="0.1"
					class="appearance-none block w-full h-1 bg-slate-200"
					bind:value={delay}
				/>
				<span class="text-slate-500 block text-center">{delay} seconds</span>
			</fieldset>
		{/if}

		{#if triggerType === "onclick"}
			<fieldset class="contents">
				<legend class="font-bold mt-4">Trigger details</legend>
				<label for="selector" class="block w-full leading-6 text-slate-700 mt-4">Selector</label>
				<input
					type="text"
					name="selector"
					id="selector"
					required
					placeholder="#my-survey-button"
					class="field-std block w-full"
					value={selector}
				/>
				<label for="delay" class="block w-full leading-6 text-slate-700 mt-4">Delay</label>
				<input
					type="range"
					name="delay"
					id="delay"
					min="0"
					max="10"
					step="0.1"
					class="appearance-none block w-full h-1 bg-slate-200"
					bind:value={delay}
				/>
				<span class="text-slate-500 block text-center">{delay} seconds</span>
			</fieldset>
		{/if}

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>

<style>
	input[type="range"]::-webkit-slider-thumb {
		width: 15px;
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		cursor: ew-resize;
		background: rgb(217, 70, 239);
		border-radius: 50%;
	}
</style>
