<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import ContainerForm from '$lib/containers/ContainerForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	console.log('Form data', form);

	$: modalVisible = !!form || false;

	const showModal = () => {
		modalVisible = true;
	};

	const hideModal = () => {
		modalVisible = false;
	};

</script>

<div class="flex flex-row gap-4 flex-wrap justify-start items-start p-8">
{#each data.containers as container}
	<div class="card variant-ghost-primary card-hover cursor-pointer">
		<header class="card-header text-lg font-bold text-primary-500">{container.name}</header>
		<section class="p-4">{container.description}</section>
		<footer class="card-footer text-sm text-secondary-300">{container.created}</footer>
	</div>
{/each}
</div>

{#if modalVisible}
	<ContainerForm on:cancel={hideModal} form={form}/>
{/if}