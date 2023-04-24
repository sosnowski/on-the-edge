<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fly } from "svelte/transition";

	export let title: string;
	const dispatch = createEventDispatcher<{
		close: void;
	}>();
</script>

<div
	transition:fly={{ x: 400 }}
	class="pointer-events-none absolute inset-y-0 right-0 flex max-w-full pl-10"
>
	<div class="pointer-events-auto w-screen max-w-lg">
		<div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
			<div class="px-4 sm:px-6">
				<div class="flex items-start justify-between">
					<h2 class="text-base font-semibold leading-6 text-gray-900" id="slide-over-title">
						{title}
					</h2>
					<div class="ml-3 flex h-7 items-center">
						<button
							on:click={() => {
								dispatch("close");
							}}
							type="button"
							class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="sr-only">Close panel</span>
							<i class="fa-solid fa-xmark" />
						</button>
					</div>
				</div>
			</div>
			<div class="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col gap-2">
				<slot />
			</div>
		</div>
	</div>
</div>
