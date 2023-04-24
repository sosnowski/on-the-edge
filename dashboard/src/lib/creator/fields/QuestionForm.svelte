<script lang="ts">
	import type { FieldType, SurveyField } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";
	import RatingConfig from "./RatingConfig.svelte";
	import TextConfig from "./TextConfig.svelte";
	import SelectConfig from "./SelectConfig.svelte";

	export let field: SurveyField | undefined = undefined;

	const dispatch = createEventDispatcher<{
		change: SurveyField;
	}>();

	type FieldTypeInfo = {
		id: FieldType;
		name: string;
		description: string;
	};

	const fieldTypes: FieldTypeInfo[] = [
		{
			id: "rating",
			name: "Rating",
			description: "Users can rate something on a scale of 1 to 5",
		},
		{
			id: "text",
			name: "Text",
			description: "Allows users to provide an open text response",
		},
		{
			id: "select",
			name: "Single Select",
			description: "Users can select one option from a list",
		},
	];

	let selectedFieldType: FieldType | undefined = field?.type || undefined;

	const onFieldTypeSelect = (fieldType: FieldTypeInfo) => {
		console.log(fieldType);
		selectedFieldType = fieldType.id;
	};

	const onFieldSave = (event: CustomEvent<SurveyField>) => {
		console.log("Field saved");
		console.log(event.detail);
		dispatch("change", event.detail);
	};
</script>

<div class="grid grid-cols-2 gap-4 my-6">
	{#each fieldTypes as fieldType}
		<button
			on:click={() => onFieldTypeSelect(fieldType)}
			class="relative grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-2 justify-items-start rounded-md bg-white p-4 shadow-md border"
			class:border-fuchsia-500={selectedFieldType === fieldType.id}
			class:border-slate-200={selectedFieldType !== fieldType.id}
		>
			<span class="font-bold col-start-1 row-start-1">{fieldType.name}</span>
			<span class="col-start-1 col-span-2 row-start-2 text-slate-500 text-sm text-left"
				>{fieldType.description}</span
			>
			<i
				class:invisible={selectedFieldType !== fieldType.id}
				class="col-start-2 row-start-1 fa-solid fa-check text-lg text-fuchsia-500"
			/>
		</button>
	{/each}
</div>

{#if selectedFieldType === "rating"}
	<RatingConfig {field} on:save={onFieldSave} />
{:else if selectedFieldType === "text"}
	<TextConfig {field} on:save={onFieldSave} />
{:else if selectedFieldType === "select"}
	<SelectConfig {field} on:save={onFieldSave} />
{/if}
