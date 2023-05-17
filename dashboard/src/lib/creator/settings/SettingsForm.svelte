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

	const triggerTypes = [
		{
			name: "Always displayed",
			value: "always",
			description: "Survey is displayed all the time.",
		},
		{
			name: "On Page Load",
			value: "onload",
			description: "Survey is displayed only on specific pages.",
		},
		{
			name: "On Click",
			value: "onclick",
			description: "Survey is displayed when user clicks on a specific element.",
		},
	];

	const onDisplayTypeSelect = (type: string) => {
		displayType = type as SurveyDisplayType;
	};

	const onTriggerTypeSelect = (type: string) => {
		triggerType = type as SurveyTrigger["type"];
	};

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
			displayType: data.get("displayType") as SurveyDisplayType,
			triggerConfig: triggerConfig,
		};

		console.log("SURVEY CONFIG", result);

		dispatch("change", result);
	};
</script>

<div class="flex flex-col gap-2 h-full">
	<form method="post" class="contents" on:submit|preventDefault={onSubmit}>
		<!-- <label for="name" class="block w-full leading-6 text-slate-700">Survey name</label>
		<input
			type="text"
			name="name"
			id="name"
			required
			class="field-std block w-full"
			placeholder="My awesome survey"
			value={survey.name || ""}
		/> -->

		<label for="displayType" class="block w-full leading-6 text-slate-700">Survey type</label>
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

		<label for="trigger" class="block w-full leading-6 text-slate-700 mt-4"
			>Display survey on:</label
		>
		<!-- <select name="trigger" id="trigger" class="field-std block w-full" bind:value={triggerType}>
			<option value="always">Survey is always displayed</option>
			<option value="onload">Displayed on specific pages</option>
			<option value="onclick">Displayed on click</option>
		</select> -->

		<input type="hidden" name="trigger" bind:value={triggerType} />

		<div class="grid grid-cols-2 gap-2">
			{#each triggerTypes as type}
				<button
					type="button"
					on:click|preventDefault={() => onTriggerTypeSelect(type.value)}
					class="relative grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-1 justify-items-start rounded-md bg-white p-4 shadow-md border hover:border-fuchsia-500"
					class:border-fuchsia-500={triggerType === type.value}
					class:border-slate-200={triggerType !== type.value}
				>
					<span class="col-start-1 row-start-1">{type.name}</span>
					<span class="col-start-1 col-span-2 row-start-2 text-slate-500 text-sm text-left"
						>{type.description}</span
					>
					<i
						class:invisible={triggerType !== type.value}
						class="col-start-2 row-start-1 fa-solid fa-check text-lg leading-4 text-fuchsia-500"
					/>
				</button>
			{/each}
		</div>

		{#if triggerType === "onload"}
			<fieldset class="contents">
				<!-- <legend class="font-bold mt-4">Trigger details</legend> -->
				<label for="pageGlob" class="block w-full leading-6 text-slate-700 mt-4"
					>Pages pattern</label
				>
				<p class="text-sm">
					Specify pattern that will match pages on which survey should be displayed. <span
						class="text-fuchsia-500 whitespace-nowrap">Use * to match any text.</span
					>
				</p>
				<input
					type="text"
					name="pageGlob"
					id="pageGlob"
					placeholder="/articles/*"
					class="field-std block w-full"
					bind:value={pageGlob}
				/>
				<!-- <label for="delay" class="block w-full leading-6 text-slate-700 mt-4">Delay</label>
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
				<span class="text-slate-500 block text-center">{delay} seconds</span> -->
			</fieldset>
		{/if}

		{#if triggerType === "onclick"}
			<fieldset class="contents">
				<!-- <legend class="font-bold mt-4">Trigger details</legend> -->
				<label for="selector" class="block w-full leading-6 text-slate-700 mt-4"
					>Element selector</label
				>
				<p class="text-sm">
					Specify <a
						href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors"
						class="underline text-fuchsia-500"
						target="_blank"
						rel="noreferrer">css selector</a
					> that will match the element that will trigger the survey.
				</p>
				<input
					type="text"
					name="selector"
					id="selector"
					required
					placeholder="#my-survey-button"
					class="field-std block w-full"
					value={selector}
				/>
				<!-- <label for="delay" class="block w-full leading-6 text-slate-700 mt-4">Delay</label>
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
				<span class="text-slate-500 block text-center">{delay} seconds</span> -->
			</fieldset>
		{/if}

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>

<style>
	/* input[type="range"]::-webkit-slider-thumb {
		width: 15px;
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		cursor: ew-resize;
		background: rgb(217, 70, 239);
		border-radius: 50%;
	} */
</style>
