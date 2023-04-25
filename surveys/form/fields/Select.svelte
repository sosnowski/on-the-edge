<script lang="ts">
    import { SelectField, SurveyField } from "shared/models/survey";
    import { createEventDispatcher } from "svelte";

    export let field: SelectField;

    const dispatch = createEventDispatcher<{
        submit: string;
    }>();

    const onSubmit = (e: SubmitEvent) => {
        const data = new FormData(e.target as HTMLFormElement);

        dispatch("submit", data.get("response") as string);
    };
</script>

<div class="flex flex-col gap-4 w-full h-full justify-start items-center">
    <p class="text-center text-slate-800 text-lg">{field.label}</p>

    <form class="contents" on:submit|preventDefault={onSubmit}>
        <select
            class="w-full rounded-md border-0 py-1.5 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-fuchsia-600 leading-6"
            name="response"
        >
            <option value="" disabled selected>Select an option</option>
            {#each field.options as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </form>
</div>
