<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte";
	import { fade } from "svelte/transition";
	import type { SurveyTrigger } from "shared/models/survey";
	import { setTrigger } from "../triggers";

	export let visible: boolean;
	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	const onClose = () => {
		dispatch("close");
	};
</script>

{#if visible}
	<div transition:fade class="absolute bottom-0 flex items-center justify-center w-full">
		<div
			class="relative overflow-hidden rounded-md bg-white text-left shadow-lg w-full max-w-lg p-2 border border-slate-100"
		>
			<slot />
			<button class="absolute top-2 right-3" on:click={onClose}>
				<i class="fa-solid fa-xmark text-slate-500 text-xl" />
			</button>
		</div>
	</div>
{/if}
