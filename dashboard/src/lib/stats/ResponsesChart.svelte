<script lang="ts">
	import { formatDate } from "$lib/helpers";
	import type { SurveyTimelineEntry } from "shared/models/stats";
	import { Line } from "svelte-chartjs";
	import "chart.js/auto";
	import { createEventDispatcher } from "svelte";

	export let data: SurveyTimelineEntry[];
	export let range: number;

	const dispatch = createEventDispatcher<{
		range: number;
	}>();

	$: config = {
		labels: data?.map((entry) => formatDate(entry.day, true)) || [],
		datasets: [
			{
				label: "Surveys Displayed",
				data: data?.map((entry) => entry.surveysDisplayed) || [],
				cubicInterpolationMode: "monotone",
				tension: 0.4,
			},
			{
				label: "Surveys Responded",
				data: data?.map((entry) => entry.surveysResponded) || [],
				cubicInterpolationMode: "monotone",
				tension: 0.4,
			},
			{
				label: "Surveys Completed",
				data: data?.map((entry) => entry.surveysCompleted) || [],
				cubicInterpolationMode: "monotone",
				tension: 0.4,
			},
		],
		scales: {
			x: {
				display: true,
				title: {
					display: true,
				},
			},
			y: {
				display: true,
				title: {
					display: true,
					text: "Value",
				},
				suggestedMin: 0,
				suggestedMax: 60,
			},
		},
	};

	const onRangeChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		dispatch("range", +target.value);
	};
</script>

<div class="w-full h-full p-4 grid grid-cols-[1fr_auto] grid-rows-[auto_1fr]">
	<h2 class="font-medium text-xl col-start-1">Survey timeline</h2>
	<div class="flex flex-row justify-end items-center gap-2">
		<p class="text-slate-500 text-sm">Show</p>
		<select
			name="range"
			id="range-selector"
			class="field-std w-auto"
			value={range.toString()}
			on:change={onRangeChange}
		>
			<option value="15">Last 15 days</option>
			<option value="30">Last 30 days</option>
			<option value="90">Last 90 days</option>
		</select>
	</div>
	<div class="w-full col-span-2">
		<Line data={config} options={{ maintainAspectRatio: false, responsive: true }} />
	</div>
</div>
