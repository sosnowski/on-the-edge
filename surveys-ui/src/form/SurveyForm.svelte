<script lang="ts">
    import { onMount } from "svelte";
    import type { SurveyInfo, SurveyPageInfo } from "shared/models/surveys/survey";
    import type { SurveyResponse } from 'shared/models/surveys/response';
    import { postResponse } from "../loader";
    import Page from "./Page.svelte";

    export let survey: SurveyInfo;
    export let userToken: string;
    export let sessionToken: string;

    let currentPage = 0;
    let sessionFinished; //load from session storage what is the status of the survey

    $: surveyFinished = currentPage >= survey.pages.length;

    onMount(() => {
        //check if survey has been displayed in this session (Session storage)
        // if not, send open event with userId and sessionId
        //store info in session storage
    });

    $: {
        // send finish event
    }

    const onPageSubmit = async (
        page: SurveyPageInfo,
        event: CustomEvent<
            Record<string, { type: "string" | "number"; content: unknown }>
        >
    ) => {
        console.log("On Page Submit");
        currentPage++;

        const responses = Object.entries(event.detail).map(
            ([fieldId, response]) => {
                return {
                    type: response.type,
                    fieldId: +fieldId,
                    content: response.content || undefined,
                };
            }
        );

        await postResponse(
            survey.surveyId,
            userToken,
            sessionToken,
            responses as SurveyResponse[]
        ); //weird typing problem
    };
</script>

<div
    class="ms-w-full ms-h-full ms-flex ms-flex-col ms-gap-4 ms-justify-center ms-items-center"
>
    {#each survey.pages as page, i}
        {#if currentPage === i}
            <div class="ms-h-full ms-w-full">
                <Page {page} on:submit={(e) => onPageSubmit(page, e)} />
            </div>
        {/if}
    {/each}

    {#if surveyFinished}
        <p>Thank you for your feedback!</p>
    {/if}
</div>
