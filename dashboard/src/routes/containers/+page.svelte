<script lang="ts">
	import SideBar from "$lib/creator/SideBar.svelte";
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import type { Container } from "shared/models/container";
	import type { PageData } from "./$types";
	import ContainerForm from "$lib/containers/ContainerForm.svelte";
	import { invalidate } from "$app/navigation";

	export let data: PageData;

	const sideBarPanels = {
		newContainer: {
			title: "Add new container",
			onSave: async (e: CustomEvent<Container>) => {
				console.log("New Container", e.detail);
				invalidate("app:containers");
				hidePanel();
			},
		},
		editContainer: {
			title: "Edit container",
			onSave: (e: CustomEvent<Container>) => {
				console.log("Edit Container", e.detail);
				invalidate("app:containers");
				hidePanel();
			},
		},
	};

	let currentSideBarPanel: keyof typeof sideBarPanels | undefined = undefined;
	let selectedContainer: Container | undefined = undefined;

	const hidePanel = () => {
		currentSideBarPanel = undefined;
		selectedContainer = undefined;
	};

	const onAdd = () => {
		currentSideBarPanel = "newContainer";
	};

	const onEdit = (container: Container) => {
		selectedContainer = container;
		currentSideBarPanel = "editContainer";
	};
</script>

<FloatingHeader breadCrumbs={[{ name: "Containers" }]}>
	<i class="fa-solid fa-grip-lines-vertical text-slate-300" />
	<button on:click={onAdd} class="btn-primary" title="Add new container"> Add container </button>
</FloatingHeader>

<h1 class="m-4 text-2xl text-slate-600">Your containers</h1>

<ul class="panel-std divide-y divide-slate-100 m-4 px-4">
	{#each data.containers as container (container.id)}
		<li class="flex items-center justify-between gap-x-6 py-5">
			<div class="min-w-0">
				<div class="flex items-start gap-x-3">
					<p class="leading-6 text-slate-900">{container.name}</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500">
					<p>{container.description}</p>
					<svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
						<circle cx="1" cy="1" r="1" />
					</svg>
					<p class="whitespace-nowrap">
						{container.domains.join(", ") || "-"}
					</p>
				</div>
			</div>
			<div class="flex flex-none items-center gap-x-4">
				<button on:click={() => onEdit(container)} class="btn-std">Edit</button>
				<a href={`/containers/${container.id}/surveys`} class="btn-primary">View Surveys</a>
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
				</div>
			</div>
		</li>
	{/each}
</ul>

{#if currentSideBarPanel && sideBarPanels[currentSideBarPanel]}
	<SideBar title={sideBarPanels[currentSideBarPanel].title} on:close={hidePanel}>
		{#if currentSideBarPanel === "newContainer"}
			<ContainerForm on:save={sideBarPanels[currentSideBarPanel].onSave} />
		{:else if currentSideBarPanel === "editContainer"}
			<ContainerForm
				container={selectedContainer}
				on:save={sideBarPanels[currentSideBarPanel].onSave}
			/>
		{/if}
	</SideBar>
{/if}
