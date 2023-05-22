<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte";
	import { fade } from "svelte/transition";
	import type { SurveyTrigger } from "shared/models/survey";
	import { setTrigger } from "../triggers";

	export let visible: boolean;
	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	let formVisible = false;

	const toggleSurvey = () => {
		formVisible = !formVisible;
	};
</script>

{#if visible}
	<button
		transition:fade
		on:click={toggleSurvey}
		class="fixed rounded-full bg-fuchsia-500 w-10 h-10 text-white p-2 bottom-2 right-2 shadow-lg"
		><svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
			/>
		</svg>
	</button>
	{#if formVisible}
		<div transition:fade class="pointer-events-none fixed left-0 right-1 bottom-8 px-6 pb-6">
			<div
				class="relative pointer-events-auto ml-auto max-w-lg rounded-md bg-white p-4 shadow-lg border border-slate-100"
			>
				<slot />
				<button class="absolute top-2 right-3" on:click={toggleSurvey}>
					<i class="fa-solid fa-xmark text-slate-500 text-xl" />
				</button>
			</div>
		</div>
	{/if}
{/if}
