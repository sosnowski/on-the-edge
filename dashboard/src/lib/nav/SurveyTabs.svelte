<script lang="ts">
	export let containerId: string;
	export let surveyId: string;
	export let activeTab: "dashboard" | "responses" | "edit" = "dashboard";
</script>

<a
	title="Survey statistics"
	href="/containers/{containerId}/surveys/{surveyId}"
	class:text-fuchsia-500={activeTab === "dashboard"}
>
	<i class="fa-solid fa-chart-pie" />
</a>
<a
	title="Show survey responses"
	href="/containers/{containerId}/surveys/{surveyId}/responses"
	class:text-fuchsia-500={activeTab === "responses"}
>
	<i class="fa-solid fa-comments" />
</a>
<a
	title="Edit survey"
	href="/containers/{containerId}/surveys/{surveyId}/edit"
	class:text-fuchsia-500={activeTab === "edit"}
>
	<i class="fa-solid fa-pen-to-square" />
</a>
