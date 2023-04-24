<script lang="ts">
	import type { SurveyField, SurveyInfo } from "shared/models/survey";
	import SideBar from "./SideBar.svelte";
	import SurveyPreview from "./preview/SurveyPreview.svelte";

	import TemplateSelector from "./templates/TemplateSelector.svelte";
	import SettingsForm from "./settings/SettingsForm.svelte";
	import QuestionForm from "./fields/QuestionForm.svelte";
	import type { Template } from "./templates/template";

	const initialSurvey: SurveyInfo = {
		id: 1,
		containerId: 1,
		name: "Test",
		display: "always",
		status: "active",
		triggerConfig: {
			type: "fixed",
		},
		fields: [],
	} satisfies SurveyInfo;

	let currentSurvey: SurveyInfo = {
		...initialSurvey,
	};

	let currentPage: number = 0;

	const sideBarPanels = {
		templates: {
			title: "Select survey template",
			onChange: (e: CustomEvent<Template>) => {
				console.log("ON TEMPLATE CHANGE", e.detail);
				currentSurvey = {
					...currentSurvey,
					fields: e.detail.fields.slice(),
				};
				console.log("AFTER CHANGE", currentSurvey);
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
			},
		},
		newQuestion: {
			title: "Add new question",
			onChange: (e: CustomEvent<SurveyField>) => {
				console.log("New Question", e.detail);
				const fields = currentSurvey.fields;
				if (currentPage < fields.length - 1) {
					fields.splice(currentPage + 1, 0, e.detail);
				} else {
					fields.push(e.detail);
				}

				currentSurvey = {
					...currentSurvey,
					fields,
				};

				if (currentPage < fields.length - 1) {
					currentPage = currentPage + 1;
				}

				hidePanel();
			},
		},
		editQuestion: {
			title: "Edit question",
			onChange: (e: CustomEvent<SurveyField>) => {
				console.log("ON FIELD EDIT", e.detail);
				const fields = currentSurvey.fields;
				fields[currentPage] = e.detail;

				currentSurvey = {
					...currentSurvey,
					fields,
				};
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
		const fields = currentSurvey.fields;
		fields.splice(currentPage, 1);

		currentSurvey = {
			...currentSurvey,
			fields,
		};

		if (currentPage > 0) {
			currentPage = currentPage - 1;
		}
	};

	const onPageChange = (e: CustomEvent<number>) => {
		currentPage = e.detail;
	};

	$: {
		console.log("SURVEY UPDATED", currentSurvey);
	}
</script>

<div class="w-full h-full relative">
	<header
		class="absolute z-10 flex flex-row justify-center items-center gap-6 bg-white shadow-md top-4 left-4 py-2 px-4 border border-slate-100 rounded-md"
	>
		<a href="/panel/containers">
			<i class="fa-solid fa-chevron-left" />
		</a>
		<span class="text-lg font-bold">Title of the survey</span>

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
					field={currentSurvey.fields[currentPage]}
					on:change={sideBarPanels.editQuestion.onChange}
				/>
			{/if}
		</SideBar>
	{/if}
</div>
