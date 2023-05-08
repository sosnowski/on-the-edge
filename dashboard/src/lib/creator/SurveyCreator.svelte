<script lang="ts">
	import { SurveyQuestion, SurveyInfo, type PublishConfig, Survey } from "shared/models/survey";
	import SideBar from "./SideBar.svelte";
	import SurveyPreview from "./preview/SurveyPreview.svelte";

	import TemplateSelector from "./templates/TemplateSelector.svelte";
	import SettingsForm from "./settings/SettingsForm.svelte";
	import QuestionForm from "./fields/QuestionForm.svelte";
	import type { Template } from "./templates/template";
	import { newEntityId } from "shared/models/base";
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import { formatDate } from "$lib/helpers";

	export let survey: SurveyInfo;

	let currentSurvey: SurveyInfo = {
		...survey,
	};

	let currentPage: number = 0;
	let saveTimer: any | undefined = undefined;
	let dirty: boolean = false;

	$: isPublished = currentSurvey.published;

	$: updatedAfterPublished =
		currentSurvey.published &&
		currentSurvey.updated &&
		currentSurvey.updated > currentSurvey.published.start;

	const sideBarPanels = {
		templates: {
			title: "Select survey template",
			onChange: (e: CustomEvent<Template>) => {
				console.log("ON TEMPLATE CHANGE", e.detail);
				currentSurvey = {
					...currentSurvey,
					questions: e.detail.questions.map((question) => {
						return {
							...question,
						};
					}),
				};
				console.log("AFTER CHANGE", currentSurvey);
				dirty = true;
				hidePanel();
			},
		},
		settings: {
			title: "Survey settings",
			onChange: (e: CustomEvent<Partial<SurveyInfo>>) => {
				console.log("ON Settings CHANGE", e.detail);
				currentSurvey = {
					...currentSurvey,
					...e.detail,
				};
				dirty = true;
				hidePanel();
			},
		},
		newQuestion: {
			title: "Add new question",
			onChange: (e: CustomEvent<SurveyQuestion>) => {
				console.log("New Question", e.detail);
				const questions = currentSurvey.questions;
				if (currentPage < questions.length - 1) {
					questions.splice(currentPage + 1, 0, e.detail);
				} else {
					questions.push(e.detail);
				}

				currentSurvey = {
					...currentSurvey,
					questions,
				};

				if (currentPage < questions.length - 1) {
					currentPage = currentPage + 1;
				}
				dirty = true;
				hidePanel();
			},
		},
		editQuestion: {
			title: "Edit question",
			onChange: (e: CustomEvent<SurveyQuestion>) => {
				console.log("ON FIELD EDIT", e.detail);
				const questions = currentSurvey.questions;
				questions[currentPage] = e.detail;

				currentSurvey = {
					...currentSurvey,
					questions,
				};
				dirty = true;
				hidePanel();
			},
		},
	};

	let currentSideBarPanel: keyof typeof sideBarPanels | undefined = undefined;

	const showPanel = (panel: keyof typeof sideBarPanels) => {
		currentSideBarPanel = panel;
	};

	const hidePanel = () => {
		currentSideBarPanel = undefined;
	};

	const onAddQuestion = (e: CustomEvent<void>) => {
		showPanel("newQuestion");
	};

	const onEditQuestion = (e: CustomEvent<void>) => {
		showPanel("editQuestion");
	};

	const onDeleteQuestion = (e: CustomEvent<void>) => {
		const questions = currentSurvey.questions;
		questions.splice(currentPage, 1);

		currentSurvey = {
			...currentSurvey,
			questions,
		};

		if (currentPage > 0) {
			currentPage = currentPage - 1;
		}
		dirty = true;
	};

	const onPageChange = (e: CustomEvent<number>) => {
		currentPage = e.detail;
	};

	const publishSurvey = async () => {
		const res = await fetch(`/api/surveys/${currentSurvey.id}/publish`, {
			method: "POST",
		});

		console.log("PUBLISH RESPONSE", res);
		console.log(res.status, res.statusText);
		const updatedSurvey = Survey.parse(await res.json());

		currentSurvey = {
			...currentSurvey,
			...updatedSurvey,
		};
	};

	const unPublishSurvey = async () => {
		const res = await fetch(`/api/surveys/${currentSurvey.id}/unpublish`, {
			method: "POST",
		});

		console.log("UNPUBLISH RESPONSE", res);
		console.log(res.status, res.statusText);
		const updatedSurvey = Survey.parse(await res.json());

		currentSurvey = {
			...currentSurvey,
			...updatedSurvey,
		};
	};

	const saveSurvey = async (survey: SurveyInfo) => {
		if (saveTimer) {
			clearTimeout(saveTimer);
		}
		saveTimer = setTimeout(async () => {
			console.log("SAVING SURVEY", survey);
			const res = await fetch(`/api/surveys/${survey.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(survey),
			});
			console.log("SAVE RESPONSE", res);
			console.log(res.status, res.statusText);

			const updatedSurvey = SurveyInfo.parse(await res.json());

			currentSurvey = {
				...updatedSurvey,
			};
			dirty = false;
		}, 1000);
	};

	$: {
		console.log("SURVEY UPDATED", currentSurvey);
		if (dirty) {
			console.log("IS DIRTY");
			saveSurvey(currentSurvey);
			dirty = false;
		}
	}
</script>

<FloatingHeader
	breadCrumbs={[
		{
			name: currentSurvey.containerName || "Container",
			href: `/containers/${currentSurvey.containerId}/surveys`,
		},
		{ name: currentSurvey.name },
	]}
>
	<i class="fa-solid fa-grip-lines-vertical text-slate-300" />
	<button class="text-lg" title="Survey settings" on:click={() => showPanel("settings")}>
		<i class="fa-solid fa-gear" />
	</button>
	<button class="text-lg" title="Use template" on:click={() => showPanel("templates")}>
		<i class="fa-regular fa-folder-open" />
	</button>
	<i class="fa-solid fa-grip-lines-vertical text-slate-300" />
	{#if isPublished}
		<p class="text-sm">
			Published from {formatDate(currentSurvey.published?.start)}
		</p>
		<button class="btn-primary bg-red-600" on:click={unPublishSurvey}>Deactivate</button>
		{#if updatedAfterPublished}
			<button class="btn-primary" on:click={publishSurvey}>Publish updated</button>
		{/if}
	{/if}

	{#if !isPublished}
		<button class="btn-primary" on:click={publishSurvey}>Publish</button>
	{/if}
</FloatingHeader>

<div class="w-full flex-1 relative">
	<SurveyPreview
		survey={currentSurvey}
		page={currentPage}
		on:add={onAddQuestion}
		on:edit={onEditQuestion}
		on:delete={onDeleteQuestion}
		on:page={onPageChange}
	/>
</div>

{#if isPublished && updatedAfterPublished}
	<div class="m-4 text-center">
		Survey has been updated after publishing.<br />Click
		<span class="text-fuchsia-500">Publish updated</span> to publish latest version.
	</div>
{/if}

<div class="flex flex-row gap-2 m-4">
	{#if currentSurvey.updated}
		<p class="text-sm text-slate-800">Last updated: {formatDate(currentSurvey.updated)}</p>
	{/if}
</div>

{#if currentSideBarPanel && sideBarPanels[currentSideBarPanel]}
	<SideBar title={sideBarPanels[currentSideBarPanel].title} on:close={hidePanel}>
		{#if currentSideBarPanel === "templates"}
			<TemplateSelector on:change={sideBarPanels.templates.onChange} />
		{:else if currentSideBarPanel === "settings"}
			<SettingsForm survey={currentSurvey} on:change={sideBarPanels.settings.onChange} />
		{:else if currentSideBarPanel === "newQuestion"}
			<QuestionForm on:change={sideBarPanels.newQuestion.onChange} />
		{:else if currentSideBarPanel === "editQuestion"}
			<QuestionForm
				question={currentSurvey.questions[currentPage]}
				on:change={sideBarPanels.editQuestion.onChange}
			/>
		{/if}
	</SideBar>
{/if}
