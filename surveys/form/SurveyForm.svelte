<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SurveyQuestion, SurveyInfo } from "shared/models/survey";
    import RatingField from "./questions/Rating.svelte";
    import TextField from "./questions/Text.svelte";
    import SelectField from "./questions/Select.svelte";

    export let survey: SurveyInfo;
    export let page: number;

    const dispatch = createEventDispatcher<{
        submit: unknown;
    }>();

    const getCmp = (question: SurveyQuestion) => {
        switch (question.type) {
            case "rating":
                return RatingField;
            case "text":
                return TextField;
            case "select":
                return SelectField;
            default:
                return null;
        }
    };

    $: currentQuestion = survey.questions[page] || null;
    $: currentQuestionCmp = getCmp(currentQuestion);

    $: {
        console.log("CURRENT SURVEY FIELD");
        console.log(currentQuestion);
    }

    const onValueChange = (field: SurveyQuestion, event: CustomEvent) => {
        // console.log(`Value change for ${field} - ${event.detail}`);
        // pageData[field.id] = event.detail;
        // console.log(pageData);
        // if (autoSubmit) {
        //     onSubmit();
        // }
    };

    // const onFieldSubmit = async (
    //     field: SurveyField,
    //     event: CustomEvent<
    //         Record<string, { type: "string" | "number"; content: unknown }>
    //     >
    // ) => {
    //     // console.log("On Page Submit");
    //     // currentPage++;
    //     // const responses = Object.entries(event.detail).map(
    //     //     ([fieldId, response]) => {
    //     //         return {
    //     //             type: response.type,
    //     //             fieldId: +fieldId,
    //     //             content: response.content || undefined,
    //     //         };
    //     //     }
    //     // );
    //     // await postResponse(
    //     //     survey.surveyId,
    //     //     userToken,
    //     //     sessionToken,
    //     //     responses as SurveyResponse[]
    //     // ); //weird typing problem
    // };
</script>

<div class="w-full flex flex-col justify-center items-center p-6">
    {#if currentQuestion}
        <svelte:component
            this={currentQuestionCmp}
            question={currentQuestion}
            on:submit={(event) => onValueChange(currentQuestion, event)}
        />
    {/if}
</div>
