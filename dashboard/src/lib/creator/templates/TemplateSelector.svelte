<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Template } from "./template";
	import templatesJson from "./templates.json";

	const dispatch = createEventDispatcher<{
		change: Template;
	}>();

	let templates = templatesJson as Template[];

	const selectTemplate = (template: Template) => {
		console.log(template);
		dispatch("change", template);
	};
</script>

<div class="grid grid-cols-1 gap-4 my-6">
	{#each templates as template}
		<button
			on:click={() => selectTemplate(template)}
			class="relative flex flex-col gap-2 rounded-md bg-white p-4 shadow-md border text-left border-slate-200 hover:border-fuchsia-500"
		>
			<span><i class={`${template.icon} text-fuchsia-500 mr-2`} />{template.name}</span>
			<span class="flex-1 text-slate-500 text-sm text-left">{template.description}</span>
			<span class="text-slate-500 text-sm text-left"
				>Contains {template.questions.length}
				{template.questions.length > 1 ? "questions" : "question"}
			</span>
		</button>
	{/each}
</div>
