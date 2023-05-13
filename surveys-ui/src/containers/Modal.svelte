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

{#if surveyVisible}
	<div transition:fade class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div transition:fade class="fixed inset-0 z-10 overflow-y-auto">
		<div
			on:click|self={onClose}
			on:keyup|self={onClose}
			class="flex min-h-full justify-center text-center items-center p-4"
		>
			<div
				class="relative overflow-hidden rounded-md bg-white p-4 text-left shadow-lg w-full max-w-xl border border-slate-100"
			>
				<slot />
			</div>
		</div>
	</div>
{/if}
