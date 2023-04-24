<script lang="ts">
	import type { SurveyInfo } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";

	export let survey: SurveyInfo;
	const dispatch = createEventDispatcher<{
		change: Partial<SurveyInfo>;
	}>();

	let triggerType = "fixed";
	let delay = 0;
	let pageRegex = "*";
	let selector = "";

	$: {
		console.log("Trigger type");
		console.log(triggerType);

		switch (triggerType) {
			case "onload":
				dispatch("change", {
					triggerConfig: {
						type: "onload",
						delay: delay,
						pageRegex: pageRegex,
					},
				});
				break;
			case "onclick":
				dispatch("change", {
					triggerConfig: {
						type: "onclick",
						delay: delay,
						selector: selector,
					},
				});
				break;
			case "fixed":
				dispatch("change", {
					triggerConfig: {
						type: "fixed",
					},
				});
				break;
		}
	}
</script>

<form method="post" class="contents">
	<label for="trigger.type" class="block w-full leading-6 text-slate-700">Trigger type</label>
	<select name="trigger.type" id="template" class="field-std block w-full" bind:value={triggerType}>
		<option value="fixed">Fixed</option>
		<option value="onload">Onload</option>
		<option value="onclick">Onclick</option>
	</select>

	{#if triggerType === "onload"}
		<label for="trigger.delay" class="block w-full leading-6 text-slate-700"
			>Delay (in seconds)</label
		>
		<input
			type="number"
			name="trigger.delay"
			id="trigger.delay"
			required
			placeholder="0"
			class="field-std block w-full"
			bind:value={delay}
		/>
		<label for="trigger.pageRegex" class="block w-full leading-6 text-slate-700">Page Regex</label>
		<input
			type="text"
			name="trigger.pageRegex"
			id="trigger.pageRegex"
			required
			placeholder="*"
			class="field-std block w-full"
			bind:value={pageRegex}
		/>
	{/if}

	{#if triggerType === "onclick"}
		<label for="trigger.delay" class="block w-full leading-6 text-slate-700"
			>Delay (in seconds)</label
		>
		<input
			type="number"
			name="trigger.delay"
			id="trigger.delay"
			required
			placeholder="0"
			class="field-std block w-full"
			bind:value={delay}
		/>
		<label for="trigger.selector" class="block w-full leading-6 text-slate-700">Selector</label>
		<input
			type="text"
			name="trigger.selector"
			id="trigger.selector"
			required
			placeholder="#survey-trigger"
			class="field-std block w-full"
			bind:value={selector}
		/>
	{/if}
</form>
