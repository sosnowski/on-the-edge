<script lang="ts">
    import ScoreIcons from "./fields/ScoreIcons.svelte";
    import TextField from "./fields/TextField.svelte";
    import { createEventDispatcher, SvelteComponent } from "svelte";
    import type { SurveyField } from "shared/models/survey";

    export let field: SurveyField;

    const dispatch = createEventDispatcher<{
        submit: Record<string, { type: "string" | "number"; content: unknown }>;
    }>();

    const pageData: Record<
        string,
        { type: "string" | "number"; content: unknown }
    > = {};

    $: autoSubmit = field.autoSubmit;
    $: fieldCmp = field.type === "rating" ? ScoreIcons : TextField;

    const onValueChange = (field: SurveyField, event: CustomEvent) => {
        console.log(`Value change for ${field} - ${event.detail}`);
        pageData[field.id] = event.detail;
        console.log(pageData);

        if (autoSubmit) {
            onSubmit();
        }
    };

    const onSubmit = async () => {
        console.log("Submit!");
        console.log(pageData);
        dispatch("submit", pageData);
    };
</script>

<div class="flex flex-col gap-2 itestretch">
    <p class="leading-6 text-gray-900 text-center">
        {field.label}
    </p>

    <svelte:component
        this={fieldCmp}
        on:change={(event) => onValueChange(field, event)}
    />

    {#if !autoSubmit}
        <button
            on:click={onSubmit}
            class="bg-red-400 text-white px-2 py-2 self-end cursor-pointer"
            >Submit</button
        >
    {/if}
</div>
