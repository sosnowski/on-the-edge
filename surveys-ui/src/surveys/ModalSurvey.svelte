<script lang="ts">
    import { onDestroy } from "svelte";
    import type { Survey } from "shared/models/survey";
    import { onLoad } from "../triggers";
    import Modal from "../containers/Modal.svelte";
    import SurveyForm from "../form/SurveyForm.svelte";
    export let survey: Survey;

    let surveyVisible = false;

    const clearTrigger = onLoad({}, () => {
        surveyVisible = true;
    });

    const closeSurvey = () => {
        surveyVisible = false;
    };

    onDestroy(() => {
        clearTrigger();
    });

    //different triggers are needed here
</script>

{#if surveyVisible}
    <Modal show={surveyVisible} on:close={closeSurvey}>
        <SurveyForm
            {survey}
            userId="user-1234567890"
            sessionId="some-session-id"
        />
    </Modal>
{/if}
