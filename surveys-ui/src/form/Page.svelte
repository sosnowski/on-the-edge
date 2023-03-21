<script lang="ts">
    import ScoreIcons from "./fields/ScoreIcons.svelte";
    import TextField from "./fields/TextField.svelte";
    import { createEventDispatcher, SvelteComponent } from "svelte";
    import type { SurveyPage, SurveyField } from "shared/models/survey";

    export let page: SurveyPage;
    const dispatch = createEventDispatcher<{
        submit: Record<string, { type: "string" | "number"; content: unknown }>;
    }>();

    const pageData: Record<
        string,
        { type: "string" | "number"; content: unknown }
    > = {};

    $: autoSubmit = page.fields.length === 1 && page.fields[0].autoSubmit;
    $: fields = page.fields.map<[typeof SvelteComponent, SurveyField]>(
        (field) => {
            let fieldCmp;

            switch (field.type) {
                case "score":
                    fieldCmp = ScoreIcons;
                    break;
                case "text":
                    fieldCmp = TextField;
                    break;
                default:
                    throw new Error("Unsupported component type " + field.type);
            }

            return [fieldCmp, field];
        }
    );

    const onValueChange = (field: SurveyField, event: CustomEvent) => {
        console.log(`Value change for ${field} - ${event.detail}`);
        pageData[field.fieldId] = event.detail;
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

<div class="ms-flex ms-flex-col gap-2 ms-items-stretch">
    <p class="ms-leading-6 ms-text-gray-900 ms-text-center">
        {page.description}
    </p>

    {#each fields as [Cmp, field]}
        <svelte:component
            this={Cmp}
            on:change={(event) => onValueChange(field, event)}
        />
    {/each}

    {#if !autoSubmit}
        <button
            on:click={onSubmit}
            class="ms-bg-red-400 ms-text-white ms-px-2 ms-py-2 ms-self-end ms-cursor-pointer"
            >Submit</button
        >
    {/if}
</div>
