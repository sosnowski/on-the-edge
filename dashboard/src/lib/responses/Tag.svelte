<script lang="ts">
	import type { Tag } from "shared/models/response";
	import { createEventDispatcher } from "svelte";

	export let tag: Tag;
	export let editMode: boolean = false;
	export let selectMode: boolean = false;

	const dispatch = createEventDispatcher<{
		click: Tag;
		delete: Tag;
	}>();

	const colors = {
		fuchsia: {
			text: "text-fuchsia-500",
			bg: "bg-fuchsia-50",
			"bg:hover": "bg-fuchsia-600/20",
			ring: "ring-fuchsia-700/10",
		},
		red: {
			text: "text-red-500",
			bg: "bg-red-50",
			"bg:hover": "bg-red-600/20",
			ring: "ring-red-700/10",
		},
		blue: {
			text: "text-blue-500",
			bg: "bg-blue-50",
			"bg:hover": "bg-blue-600/20",
			ring: "ring-blue-700/10",
		},
		green: {
			text: "text-green-500",
			bg: "bg-green-50",
			"bg:hover": "bg-green-600/20",
			ring: "ring-green-700/10",
		},
		gray: {
			text: "text-gray-500",
			bg: "bg-gray-50",
			"bg:hover": "bg-gray-600/20",
			ring: "ring-gray-700/10",
		},
	};

	$: color = colors[tag.color as keyof typeof colors] || colors.gray;
</script>

<span
	class={`inline-flex items-center gap-x-1 rounded-md ${color.bg} px-2 py-1 text-xs font-medium ${color.text} ring-1 ring-inset ${color.ring}`}
	class:cursor-pointer={selectMode}
	on:click={() => dispatch("click", tag)}
	on:keyup={() => dispatch("click", tag)}
>
	<i class="fa-solid fa-tag" />
	{tag.label}

	{#if editMode}
		<button
			type="button"
			class={`group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:${color["bg:hover"]}`}
			on:click|stopPropagation={() => dispatch("delete", tag)}
		>
			<i class="fa-solid fa-xmark" />
			<span class="absolute -inset-1" />
		</button>
	{/if}
</span>
