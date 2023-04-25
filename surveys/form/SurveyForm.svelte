<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SurveyField, SurveyInfo } from "shared/models/survey";
    import RatingField from "./fields/Rating.svelte";
    import TextField from "./fields/Text.svelte";
    import SelectField from "./fields/Select.svelte";

    export let survey: SurveyInfo;
    export let page: number;

    const dispatch = createEventDispatcher<{
        submit: unknown;
    }>();

    const getCmp = (field: SurveyField) => {
        switch (field.type) {
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

    $: currentField = survey.fields[page] || null;
    $: currentFieldCmp = getCmp(currentField);

    $: {
        console.log("CURRENT SURVEY FIELD");
        console.log(currentField);
    }

    const onValueChange = (field: SurveyField, event: CustomEvent) => {
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
    {#if currentField}
        <svelte:component
            this={currentFieldCmp}
            field={currentField}
            on:submit={(event) => onValueChange(currentField, event)}
        />
    {/if}
</div>
