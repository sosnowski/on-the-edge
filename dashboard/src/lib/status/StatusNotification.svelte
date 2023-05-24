<script lang="ts">
	import { slide } from "svelte/transition";
	import { status } from "./status_store";
</script>

{#if $status}
	<div
		transition:slide={{ delay: 100, duration: 300 }}
		class="py-2 px-4 fixed top-4 right-4 rounded-md shadow-md flex flex-row justify-center items-center gap-4"
		class:bg-green-50={$status.type === "success"}
		class:bg-red-50={$status.type === "error"}
		class:bg-white={$status.type === "info"}
		class:bg-slate-50={$status.type === "loading"}
	>
		{#if $status.type === "success"}
			<i class="fa-regular fa-circle-check text-lg text-green-500" />
		{:else if $status.type === "error"}
			<i class="fa-regular fa-circle-xmark text-lg text-red-500" />
		{:else if $status.type === "info"}
			<i class="fa-solid fa-circle-info text-lg text-fuchsia-500" />
		{:else if $status.type === "loading"}
			<i class="fa-solid fa-spinner fa-spin-pulse text-lg text-fuchsia-500" />
		{/if}
		<p class="text-sm text-slate-600">{$status.message}</p>
	</div>
{/if}
