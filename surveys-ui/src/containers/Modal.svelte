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
	<div transition:fade class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div transition:fade class="fixed inset-0 z-10 overflow-y-auto">
		<div
			on:click|self={onClose}
			on:keyup|self={onClose}
			class="flex min-h-full justify-center text-center items-center p-4"
		>
			<div
				class="relative overflow-hidden rounded-md bg-white p-2 text-left shadow-lg w-full max-w-lg border border-slate-100"
			>
				<slot />
				<button class="absolute top-2 right-3" on:click={onClose}>
					<i class="fa-solid fa-xmark text-slate-500 text-xl" />
				</button>
			</div>
		</div>
	</div>
{/if}
