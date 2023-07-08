<script lang="ts">
	import { Line } from "svelte-chartjs";
	import "chart.js/auto";

	const data = {
		labels: ["Displayed", "Responded", "Completed"],
		datasets: [
			{
				label: "Displayed",
				backgroundColor: ["hsl(0, 100%, 35%)", "#fff"],
				data: [100, 0],
			},
			{
				label: "Responded",
				backgroundColor: ["hsl(100, 100%, 35%)", "#fff"],
				data: [70, 30],
			},
			{
				label: "Completed",
				backgroundColor: ["hsl(180, 100%, 35%)", "#fff"],
				data: [40, 60],
			},
		],
	};
</script>

<div class="w-full h-full p-2">
	<Line {data} options={{ maintainAspectRatio: false, responsive: true }} />
</div>
