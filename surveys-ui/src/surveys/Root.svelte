<script lang="ts">
	import type { SurveyInfo } from "shared/models/survey";
	import Fab from "../containers/Fab.svelte";
	import Modal from "../containers/Modal.svelte";
	import Toast from "../containers/Toast.svelte";
	import Survey from "./Survey.svelte";

	export let surveys: SurveyInfo[] = [];
	export let userToken: string;
	export let sessionToken: string;

	const getSurveyContainer = (survey: SurveyInfo) => {
		switch (survey.displayType) {
			case "fab":
				return Fab;
			case "modal":
				return Modal;
			case "toast":
				return Toast;
		}
	};
</script>

{#each surveys as survey (survey.id)}
	<svelte:component this={getSurveyContainer(survey)} triggerConfig={survey.triggerConfig}>
		<Survey {survey} {userToken} {sessionToken} />
	</svelte:component>
{/each}
