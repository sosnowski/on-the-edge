<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

	export let shadow: boolean = false;
	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	const close = () => {
		console.log("On Close");
		dispatch("close");
	};
</script>

<div
	on:click={close}
	on:keydown={close}
	class="fixed inset-0 bg-opacity-50 z-20"
	class:bg-black={shadow}
/>
<div transition:fade class={`absolute panel-std p-2 z-30 ${$$props.class}`}>
	<slot />
</div>
