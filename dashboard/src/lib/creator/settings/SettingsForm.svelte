<script lang="ts">
	import type {
		OnClickTrigger,
		OnLoadTrigger,
		SurveyDisplayType,
		SurveyInfo,
		SurveyTrigger,
		SurveyTriggerType,
		TriggerLimit,
	} from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let survey: SurveyInfo;
	const dispatch = createEventDispatcher<{
		change: Partial<SurveyInfo>;
	}>();

	let triggerType = survey.triggerConfig.type;
	let triggerLimit = survey.triggerConfig.limit;
	let pageGlob = (survey.triggerConfig as OnLoadTrigger).pageGlob || "";
	let selector = (survey.triggerConfig as OnClickTrigger).selector || "";

	const triggerTypes = [
		// {
		// 	name: "Always displayed",
		// 	value: "always",
		// 	description: "Survey is displayed all the time.",
		// },
		{
			name: "Page is loaded",
			value: "onload",
			description: "Survey is displayed when the page(s) loads.",
		},
		{
			name: "User clicks on element",
			value: "onclick",
			description: "Survey is displayed when user clicks on a specific element.",
		},
	];

	const limitTypes = [
		{
			name: "Once per session",
			value: "session",
			description: "Survey is displayed only once per session.",
		},
		{
			name: "Once per user",
			value: "user",
			description: "Survey is displayed only once per user.",
		},
		{
			name: "Display every time",
			value: "none",
			description: "Survey is displayed every time the trigger is activated.",
		},
	];

	const onTriggerTypeSelect = (type: string) => {
		triggerType = type as SurveyTriggerType;
	};

	const onTriggerLimitSelect = (limit: string) => {
		triggerLimit = limit as TriggerLimit;
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
					pageGlob: (data.get("pageGlob") as string) || undefined,
					limit: data.get("limit") as TriggerLimit,
				};
				break;
			case "onclick":
				triggerConfig = {
					type: "onclick",
					selector: data.get("selector") as string,
					limit: data.get("limit") as TriggerLimit,
				};
				break;
			case "always":
			default:
				triggerConfig = {
					type: "always",
					limit: data.get("limit") as TriggerLimit,
				};
				break;
		}

		const result: Partial<SurveyInfo> = {
			triggerConfig: triggerConfig,
		};

		console.log("SURVEY CONFIG", result);

		dispatch("change", result);
	};
</script>

<div class="flex flex-col gap-2 h-full">
	<form method="post" class="contents" on:submit|preventDefault={onSubmit}>
		<label for="trigger" class="block w-full leading-6 text-slate-700">Show survey when</label>
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
					You can specify the URL pattern to display the survey only on specific pages. <span
						class="text-fuchsia-500 whitespace-nowrap">Use * to match any text.</span
					> Leave empty to display on all pages.
				</p>
				<input
					type="text"
					name="pageGlob"
					id="pageGlob"
					placeholder="/articles/*"
					class="field-std block w-full"
					bind:value={pageGlob}
				/>
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
			</fieldset>
		{/if}

		<label for="limit" class="block w-full leading-6 text-slate-700 mt-4">Display once per</label>
		<input type="hidden" name="limit" bind:value={triggerLimit} />

		<div class="grid grid-cols-2 gap-2">
			{#each limitTypes as type}
				<button
					type="button"
					on:click|preventDefault={() => onTriggerLimitSelect(type.value)}
					class="relative grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-1 justify-items-start rounded-md bg-white p-4 shadow-md border hover:border-fuchsia-500"
					class:border-fuchsia-500={triggerLimit === type.value}
					class:border-slate-200={triggerLimit !== type.value}
				>
					<span class="col-start-1 row-start-1">{type.name}</span>
					<span class="col-start-1 col-span-2 row-start-2 text-slate-500 text-sm text-left"
						>{type.description}</span
					>
					<i
						class:invisible={triggerLimit !== type.value}
						class="col-start-2 row-start-1 fa-solid fa-check text-lg leading-4 text-fuchsia-500"
					/>
				</button>
			{/each}
		</div>

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
