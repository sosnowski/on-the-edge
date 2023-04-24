<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import type { SurveyField, SurveyInfo } from "shared/models/survey";
    import Page from "./Page.svelte";

    export let survey: SurveyInfo;
    export let page: number;

    const dispatch = createEventDispatcher<{
        submit: unknown;
    }>();

    let sessionFinished; //load from session storage what is the status of the survey

    $: fields = survey.fields;
    $: {
        console.log("FIELDS");
        console.log(fields);
    }
    $: surveyFinished = page >= survey.fields.length;

    onMount(() => {
        //check if survey has been displayed in this session (Session storage)
        // if not, send open event with userId and sessionId
        //store info in session storage
    });

    $: {
        // send finish event
    }

    const onFieldSubmit = async (
        field: SurveyField,
        event: CustomEvent<
            Record<string, { type: "string" | "number"; content: unknown }>
        >
    ) => {
        // console.log("On Page Submit");
        // currentPage++;
        // const responses = Object.entries(event.detail).map(
        //     ([fieldId, response]) => {
        //         return {
        //             type: response.type,
        //             fieldId: +fieldId,
        //             content: response.content || undefined,
        //         };
        //     }
        // );
        // await postResponse(
        //     survey.surveyId,
        //     userToken,
        //     sessionToken,
        //     responses as SurveyResponse[]
        // ); //weird typing problem
    };
</script>

<div class="w-full h-full flex flex-col gap-4 justify-center itecenter">
    {#each survey.fields as field, i}
        {#if page === i}
            <div class="h-full w-full">
                <Page {field} on:submit={(e) => onFieldSubmit(field, e)} />
            </div>
        {/if}
    {/each}

    {#if surveyFinished}
        <p>Thank you for your feedback!</p>
    {/if}
</div>
