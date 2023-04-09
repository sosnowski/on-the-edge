<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

</script>

<div class="flex flex-row gap-4 flex-wrap justify-start items-start p-8">
{#each data.containers as container}
	<a href={`/containers/${container.id}/surveys`} class="card variant-ghost-primary card-hover cursor-pointer">
		<header class="card-header text-lg font-bold text-primary-500">{container.name}</header>
		<section class="p-4">{container.description}</section>
		<footer class="card-footer text-sm text-secondary-300">{container.created}</footer>
	</a>
{/each}
</div>

<a href="/containers/add">Add container</a>