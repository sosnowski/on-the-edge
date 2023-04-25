<script lang="ts">
	import type { SelectField, SelectFieldOption, SurveyField } from "shared/models/survey";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import { nanoid } from "nanoid";

	export let field: SurveyField | undefined = undefined;
	const dispatch = createEventDispatcher<{ save: SelectField }>();

	let options: SelectFieldOption[] = (field as SelectField)?.options || [{ label: "", value: "" }];

	const onSubmit = (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);
		const field: SelectField = {
			type: "select",
			label: data.get("label") as string,
			autoSubmit: true,
			options: options.map((opt, index) => {
				return {
					label: opt.label,
					value: opt.value || `option-${index}-${nanoid(10)}`,
				};
			}),
		};

		console.log(Object.fromEntries(data.entries()));
		console.log("options", options);
		console.log(field);

		dispatch("save", field);
	};

	const addOption = () => {
		options = [...options, { label: "", value: "" }];
	};

	const removeOption = (index: number) => {
		if (options.length === 1) return;
		options = options.filter((_, i) => i !== index);
	};
</script>

<div class="flex flex-col gap-2 h-full">
	<form method="post" class="contents" on:submit|preventDefault={onSubmit}>
		<label for="label" class="block w-full leading-6 text-slate-700">Question</label>
		<textarea
			name="label"
			id="label"
			required
			class="field-std block w-full"
			placeholder="How do you rate your experience?"
			value={field?.label || ""}
		/>

		<label for="options[0]" class="block w-full leading-6 text-slate-700 mt-4"
			>Available options</label
		>
		{#each options as _, i (i)}
			<div
				in:fade={{ duration: 200 }}
				class="flex flex-row justify-start items-center w-full gap-2"
			>
				<span class="text-sm text-slate-600 font-bold w-4">{i + 1}.</span>
				<input
					required
					type="text"
					name={`options[${i}]`}
					id={`options[${i}]`}
					class="field-std block flex-1"
					bind:value={options[i].label}
				/>
				<button
					on:click={() => removeOption(i)}
					type="button"
					title="Delete option"
					class="btn-std h-9 w-9 flex justify-center items-center"
					class:hidden={options.length === 1}
				>
					<i class="fa-regular fa-trash-can" />
				</button>
				<button
					on:click={addOption}
					type="button"
					title="Add option"
					class="btn-std h-9 w-9 flex justify-center items-center text-fuchsia-500"
					class:invisible={i !== options.length - 1}><i class="fa-solid fa-plus" /></button
				>
			</div>
		{/each}

		<button type="submit" class="btn-primary w-1/3 self-center my-4">Save</button>
	</form>
</div>
