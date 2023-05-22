<script lang="ts">
	import type { EntityId, SurveyInfo, SurveyMetadata, Token } from "shared/models/survey";
	import Fab from "../containers/Fab.svelte";
	import Modal from "../containers/Modal.svelte";
	import Toast from "../containers/Toast.svelte";
	import Survey from "./Survey.svelte";
	import { setTrigger } from "../triggers";
	import { loadSurvey } from "../loader";
	import { onDestroy } from "svelte";

	export let containerId: string;
	export let userToken: Token;
	export let surveysMeta: SurveyMetadata[] = [];

	const surveys: Record<EntityId, SurveyInfo> = {};
	const surveysVisibility: Record<EntityId, boolean> = {};
	$: surveysToRender = Object.values(surveys);

	const viewedInSession = new Set<EntityId>(
		sessionStorage.getItem("viewed-suveys")?.split(",") ?? [],
	);

	const triggersToClear = [];

	for (const meta of surveysMeta) {
		console.log("Setting trigger for ", meta.surveyId);
		triggersToClear.push(
			setTrigger(
				meta.triggerConfig,
				async () => {
					console.log("Already viewed in session", viewedInSession);
					const surveyId = meta.surveyId;
					if (
						(meta.triggerConfig.limit === "session" || meta.triggerConfig.limit === "user") &&
						viewedInSession.has(surveyId)
					) {
						console.log("Survey was already displayed in this session");
						return;
					}

					if (!surveys[surveyId]) {
						console.log("Loading survey details for ", surveyId);
						const surveyInfo = await loadSurvey(userToken, containerId, surveyId);
						console.log("Survey details", surveyInfo);
						if (surveyInfo) {
							surveys[surveyId] = surveyInfo;
							showSurvey(surveyId);
						}
					} else {
						console.log("Survey was already loaded");
						console.log("Display the survey");
						showSurvey(surveyId);
					}
				},
				() => {
					hideSurvey(meta.surveyId);
				},
			),
		);
	}

	const showSurvey = (surveyId: EntityId) => {
		surveysVisibility[surveyId] = true;
		viewedInSession.add(surveyId);
		sessionStorage.setItem("viewed-suveys", [...viewedInSession].join(","));
	};

	const hideSurvey = (surveyId: EntityId) => {
		surveysVisibility[surveyId] = false;
	};

	onDestroy(() => {
		//clear all triggers
		for (const cleaner of triggersToClear) {
			cleaner();
		}
	});

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

	const onClose = (surveyId: EntityId) => {
		hideSurvey(surveyId);
	};
</script>

{#each surveysToRender as survey (survey.id)}
	<svelte:component
		this={getSurveyContainer(survey)}
		visible={surveysVisibility[survey.id]}
		on:close={() => onClose(survey.id)}
	>
		<Survey {userToken} {survey} />
	</svelte:component>
{/each}
