<script lang="ts">
	import type { SurveyQuestion, SurveyInfo } from "shared/models/survey";
	import SideBar from "./SideBar.svelte";
	import SurveyPreview from "./preview/SurveyPreview.svelte";

	import TemplateSelector from "./templates/TemplateSelector.svelte";
	import SettingsForm from "./settings/SettingsForm.svelte";
	import QuestionForm from "./fields/QuestionForm.svelte";
	import type { Template } from "./templates/template";

	export let survey: SurveyInfo;

	let currentSurvey: SurveyInfo = {
		...survey,
	};

	let currentPage: number = 0;
	let saveTimer: any | undefined = undefined;
	let dirty: boolean = false;

	const sideBarPanels = {
		templates: {
			title: "Select survey template",
			onChange: (e: CustomEvent<Template>) => {
				console.log("ON TEMPLATE CHANGE", e.detail);
				currentSurvey = {
					...currentSurvey,
					questions: e.detail.questions.slice(),
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

<div class="w-full h-full relative">
	<header
		class="absolute z-10 flex flex-row justify-center items-center gap-6 bg-white shadow-md top-4 left-4 py-2 px-4 border border-slate-100 rounded-md"
	>
		<a href={`/containers/${currentSurvey.containerId}/surveys`}>
			<i class="fa-solid fa-chevron-left" />
		</a>
		<span class="text-lg font-bold outline-none px-2 focus:outline-none max-w-xs truncate"
			>{currentSurvey.name}</span
		>

		<button class="text-lg" title="Survey settings" on:click={() => showPanel("settings")}>
			<i class="fa-solid fa-gear" />
		</button>
		<button class="text-lg" title="Use template" on:click={() => showPanel("templates")}>
			<i class="fa-regular fa-folder-open" />
		</button>
		<button class="btn-primary">Publish</button>
	</header>
	<SurveyPreview
		survey={currentSurvey}
		page={currentPage}
		on:add={onAddQuestion}
		on:edit={onEditQuestion}
		on:delete={onDeleteQuestion}
		on:page={onPageChange}
	/>

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
</div>
