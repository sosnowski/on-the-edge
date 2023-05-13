<script lang="ts">
	import { onDestroy } from "svelte";
	import { fade } from "svelte/transition";
	import type { SurveyTrigger } from "shared/models/survey";
	import { setTrigger } from "../triggers";

	export let triggerConfig: SurveyTrigger;
	let surveyVisible = true;

	const clearTrigger = setTrigger(triggerConfig, () => {
		surveyVisible = true;
	});

	onDestroy(() => {
		clearTrigger();
	});

	const onClose = () => {
		surveyVisible = false;
	};
</script>

<div transition:fade class="absolute bottom-0 flex items-center justify-center w-full">
	<div
		class="relative overflow-hidden rounded-md bg-white p-4 text-left shadow-lg w-full max-w-xl border border-slate-100"
	>
		<slot />
	</div>
</div>
