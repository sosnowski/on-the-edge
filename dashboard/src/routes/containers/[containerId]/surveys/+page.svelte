<script lang="ts">
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import { formatDateTime } from "$lib/helpers";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<FloatingHeader
	breadCrumbs={[{ name: "Containers", href: "/containers" }, { name: data.container.name }]}
>
	<i class="fa-solid fa-grip-lines-vertical text-slate-300" />
	<button class="text-lg" title="Container settings">
		<i class="fa-solid fa-gear" />
	</button>
	<i class="fa-solid fa-grip-lines-vertical text-slate-300" />
	<form action="/api/surveys" method="POST">
		<input type="hidden" name="containerId" value={data.container.id} />
		<button type="submit" class="btn-primary" title="Add new survey"> Add new survey </button>
	</form>
</FloatingHeader>

<h1 class="m-4 text-2xl text-slate-600">Surveys in this container</h1>

<ul class="panel-std divide-y divide-slate-100 m-4 px-4">
	{#each data.surveys as survey (survey.id)}
		<li class="flex items-center justify-between gap-x-6 py-5">
			<div class="min-w-0">
				<div class="flex items-start gap-x-3">
					<p class="text-sm font-bold leading-6 text-slate-900">{survey.name}</p>
					{#if survey.status === "active"}
						<p
							class="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20"
						>
							Active
						</p>
					{:else if survey.status === "inactive"}
						<p
							class="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-slate-600 bg-slate-50 ring-slate-500/10"
						>
							Inactive
						</p>
					{/if}
				</div>
				<div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
					{#if survey.updated}
						<p class="whitespace-nowrap">
							Last updated <time datetime="2023-03-17T00:00Z">{formatDateTime(survey.updated)}</time
							>
						</p>
					{/if}
					<!-- <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
						<circle cx="1" cy="1" r="1" />
					</svg>
					<p class="truncate">Created by Leslie Alexander</p> -->
				</div>
			</div>
			<div class="flex flex-none items-center gap-x-4">
				<a
					title="Survey statistics"
					href={`/containers/${survey.containerId}/surveys/${survey.id}`}
					class="btn-primary"><i class="fa-solid fa-chart-pie" />Details</a
				>
				<a
					title="Show survey responses"
					href={`/containers/${survey.containerId}/surveys/${survey.id}/responses`}
					class="text-slate-500 hover:text-fuchsia-500"><i class="fa-solid fa-comments" /></a
				>
				<a
					title="Edit survey"
					href="/containers/{survey.containerId}/surveys/{survey.id}/edit"
					class="text-slate-500 hover:text-fuchsia-500"
				>
					<i class="fa-solid fa-pen-to-square" />
				</a>
			</div>
		</li>
	{/each}
</ul>
