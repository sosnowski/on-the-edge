<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Template } from "./template";
	import templatesJson from "./templates.json";
	import type { SurveyInfo } from "shared/models/survey";

	const dispatch = createEventDispatcher<{
		change: Template;
	}>();

	let templates = templatesJson as Template[];

	const selectTemplate = (template: Template) => {
		console.log(template);
		dispatch("change", template);
	};
</script>

<ul class="flex flex-col gap-4">
	{#each templates as template}
		<li
			on:click={() => selectTemplate(template)}
			on:keydown={() => selectTemplate(template)}
			class="rounded-md border border-slate-200 hover:border-fuchsia-200 flex flex-col pb-2 cursor-pointer hover:shadow-md"
		>
			<div class="bg-fuchsia-100 text-lg p-4 border-b border-slate-200 flex items-center gap-2">
				{template.name}
			</div>
			<div class="p-4 bg-white text-slate-500">{template.description}</div>
		</li>
	{/each}
</ul>
