<script lang="ts">
    import { onDestroy } from "svelte";
    import type { SurveyInfo } from "shared/models/survey";
    import { onLoad } from "../triggers";
    import Modal from "../containers/Modal.svelte";
    import SurveyForm from "../form/SurveyForm.svelte";

    export let survey: SurveyInfo;
    export let userToken: string;
    export let sessionToken: string;

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
    <Modal on:close={closeSurvey}>
        <SurveyForm {survey} {userToken} {sessionToken} />
    </Modal>
{/if}
