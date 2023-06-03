<script lang="ts">
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import { formatDate } from "$lib/helpers";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<FloatingHeader
	breadCrumbs={[{ name: "Containers", href: "/containers" }, { name: data.container.name }]}
>
	<button class="text-lg" title="Container settings">
		<i class="fa-solid fa-gear" />
	</button>

	<form action="/api/surveys" method="POST">
		<input type="hidden" name="containerId" value={data.container.id} />
		<button type="submit" class="btn-primary" title="Add new survey"> Add new survey </button>
	</form>
</FloatingHeader>

<h1 class="m-4 text-2xl text-slate-600">Surveys in this container</h1>

<ul
	class="divide-y divide-slate-100 bg-white shadow-md m-4 rounded-md border border-slate-100 px-4"
>
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
							Last updated <time datetime="2023-03-17T00:00Z">{formatDate(survey.updated)}</time>
						</p>
					{/if}
					<!-- <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
						<circle cx="1" cy="1" r="1" />
					</svg>
					<p class="truncate">Created by Leslie Alexander</p> -->
				</div>
			</div>
			<div class="flex flex-none items-center gap-x-4">
				<a href={`/containers/${survey.containerId}/surveys/${survey.id}`} class="btn-std">Edit</a>
				<a
					href={`/containers/${survey.containerId}/surveys/${survey.id}/responses`}
					class="btn-primary">View Responses</a
				>
				<div class="relative flex-none">
					<button
						type="button"
						class="-m-2.5 block p-2.5 text-slate-500 hover:text-slate-800"
						id="options-menu-0-button"
						aria-expanded="false"
						aria-haspopup="true"
					>
						<span class="sr-only">Open options</span>
						<i class="fa-solid fa-ellipsis-vertical" />
					</button>

					<!-- <div
						class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu-0-button"
						tabindex="-1"
					>
						 Active: "bg-gray-50", Not Active: "" 
						<a
							href="#"
							class="block px-3 py-1 text-sm leading-6 text-gray-900"
							role="menuitem"
							tabindex="-1"
							id="options-menu-0-item-0">Edit<span class="sr-only">, GraphQL API</span></a
						>
						<a
							href="#"
							class="block px-3 py-1 text-sm leading-6 text-gray-900"
							role="menuitem"
							tabindex="-1"
							id="options-menu-0-item-1">Move<span class="sr-only">, GraphQL API</span></a
						>
						<a
							href="#"
							class="block px-3 py-1 text-sm leading-6 text-gray-900"
							role="menuitem"
							tabindex="-1"
							id="options-menu-0-item-2">Delete<span class="sr-only">, GraphQL API</span></a
						>
					</div> -->
				</div>
			</div>
		</li>
	{/each}
</ul>
