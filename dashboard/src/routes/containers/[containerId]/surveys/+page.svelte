<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="container mx-auto h-full">
	<div class="flex flex-row gap-4 flex-wrap justify-start items-start p-8">
		{#each data.surveys as survey (survey.id)}
			<a
				href={`/containers/${survey.containerId}/surveys/${survey.id}`}
				class="card variant-ghost-primary card-hover cursor-pointer"
			>
				<header class="card-header text-lg font-bold text-primary-500">{survey.name}</header>
				<section class="p-4">{survey.displayType}</section>
				<footer class="card-footer text-sm text-secondary-300">
					{survey.triggerConfig.type}, status: {survey.status}
				</footer>
			</a>
		{:else}
			<p class="text-center">No surveys found</p>
		{/each}
	</div>

	<div
		class="border border-dashed border-slate-200 rounded-md w-full py-6 flex flex-col justify-center items-center"
	>
		<a href={`/containers/${data.containerId}/surveys/create`} class="btn-std text-base">
			<i class="fa-solid fa-plus text-slate-400" /> Add survey
		</a>
	</div>
</div>
