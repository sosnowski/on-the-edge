<script lang="ts">
	import type { SurveyStats, SurveyTimelineEntry } from "shared/models/stats";
	import ResponsesChart from "./ResponsesChart.svelte";
	import { createEventDispatcher } from "svelte";

	export let stats: SurveyStats;
	export let timeline: SurveyTimelineEntry[];
	export let range: number;

	const dispatch = createEventDispatcher<{
		range: number;
	}>();

	$: surveysDisplayed = stats.surveysDisplayed;
	$: numberOfResponses = stats.numberOfResponses;
	$: surveysResponded = stats.surveysResponded;
	$: surveysCompleted = stats.surveysCompleted;
	$: conversionRate = Math.round((surveysResponded / surveysDisplayed) * 100);
	$: completionRate = Math.round((surveysCompleted / surveysDisplayed) * 100);

	const onTimelineRangeChange = (event: CustomEvent<number>) => {
		dispatch("range", event.detail);
	};
</script>

<div class="flex-1 grid grid-cols-4 grid-rows-3 flex-wrap gap-2 px-4">
	<div class="panel-std relative">
		<div class="flex flex-col gap-4 justify-center items-center h-full">
			<div class="text-7xl font-medium text-slate-600">{surveysDisplayed}</div>
			<div class="text-sm">Surveys displayed</div>
		</div>
		<button class="text-fuchsia-500 absolute right-3 top-2 text-xl">
			<i class="fa-regular fa-circle-question" />
		</button>
	</div>
	<div class="panel-std relative">
		<div class="flex flex-col gap-4 justify-center items-center h-full">
			<div class="text-7xl font-medium text-slate-600">{numberOfResponses}</div>
			<div class="text-sm">Questions answered</div>
		</div>
		<button class="text-fuchsia-500 absolute right-3 top-2 text-xl">
			<i class="fa-regular fa-circle-question" />
		</button>
	</div>
	<div class="panel-std relative">
		<div class="flex flex-col gap-4 justify-center items-center h-full">
			<div class="text-7xl font-medium text-slate-600">{conversionRate}%</div>
			<div class="text-sm">Conversion rate</div>
		</div>
		<button class="text-fuchsia-500 absolute right-3 top-2 text-xl">
			<i class="fa-regular fa-circle-question" />
		</button>
	</div>
	<div class="panel-std relative">
		<div class="flex flex-col gap-4 justify-center items-center h-full">
			<div class="text-7xl font-medium text-slate-600">{completionRate}%</div>
			<div class="text-sm">Completion rate</div>
		</div>
		<button class="text-fuchsia-500 absolute right-3 top-2 text-xl">
			<i class="fa-regular fa-circle-question" />
		</button>
	</div>
	<div class="panel-std col-span-4">
		<ResponsesChart data={timeline} {range} on:range={onTimelineRangeChange} />
	</div>
	<div class="panel-std col-span-4">{JSON.stringify(stats)}</div>
</div>
