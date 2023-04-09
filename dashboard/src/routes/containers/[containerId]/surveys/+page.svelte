<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex flex-row gap-4 flex-wrap justify-start items-start p-8">
{#each data.surveys as survey}
	<a href={`/containers/${survey.containerId}/surveys/${survey.id}`} class="card variant-ghost-primary card-hover cursor-pointer">
		<header class="card-header text-lg font-bold text-primary-500">{survey.name}</header>
		<section class="p-4">{survey.type} / {survey.display}</section>
		<footer class="card-footer text-sm text-secondary-300">{survey.triggerConfig.type}, status: {survey.status}</footer>
	</a>
{:else}
	<p class="text-center">No surveys found</p> 
{/each}
</div>

<a href={`/containers/${data.containerId}/surveys/add`}>Add survey</a>
