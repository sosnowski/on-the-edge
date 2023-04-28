<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="container mx-auto h-full">
	<h1 class="text-3xl text-slate-800 p-4 my-4 flex flex-row justify-start items-center gap-2">
		<i
			class="fa-regular fa-folder flex justify-center items-center text-fuchsia-500 text-2xl h-9"
		/>
		Containers
	</h1>

	<section class="mx-auto flex flex-row gap-4 p-4 flex-wrap justify-start items-start">
		{#each data.containers as container}
			<a
				href={`/containers/${container.id}/surveys`}
				class="bg-white border border-slate-200 rounded-md shadow-md p-4 w-full sm:w-72"
			>
				<header class="card-header text-lg font-bold text-primary-500">{container.name}</header>
				<section class="p-4">{container.description}</section>
				<footer class="card-footer text-sm text-secondary-300">{container.created}</footer>
			</a>
		{/each}
		<div
			class="border border-dashed border-slate-200 rounded-md w-full py-6 flex flex-col justify-center items-center"
		>
			<a href="/containers/add" class="btn-std text-base">
				<i class="fa-solid fa-plus text-slate-400" /> Add container
			</a>
		</div>
	</section>
</div>
