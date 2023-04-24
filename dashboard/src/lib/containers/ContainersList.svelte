<script lang="ts">
	import type { Container } from "shared/models/container";
	import { createEventDispatcher } from "svelte";

	export let containers: Container[];
	const dispatch = createEventDispatcher<{
		add: void;
	}>();
</script>


<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
	  <div class="sm:flex-auto">
		<h1 class="text-base font-semibold leading-6 text-gray-900">Containers</h1>
		<p class="mt-2 text-sm text-gray-700">A list of all your containers.</p>
	  </div>
	  <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
		<button on:click={() => dispatch('add')} type="button" class="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add container</button>
	  </div>
	</div>
	<div class="mt-8 flow-root">
	  <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
		  <table class="min-w-full divide-y divide-gray-300">
			<thead>
			  <tr>
				<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
				<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Number of surveys</th>
				<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
				  <span class="sr-only">Edit</span>
				</th>
			  </tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each containers as container}
				<tr>
					<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0 font-medium text-gray-900">
						<div class="font-medium text-gray-900">{container.name}</div>
						<div class="text-gray-500">{container.id}</div>
					</td>
					<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
					  <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">{container.surveysCount || 0}</span>
					</td>
					<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
					  <a href={`/containers/${container.id}/surveys`} class="text-indigo-600 hover:text-indigo-900">Manage</a>
					</td>
				  </tr>

				{:else}
				  <tr>
					<td class="py-4 pl-4 pr-3 text-sm sm:pl-0 font-medium text-gray-900" colspan="3">
						<div class="font-medium text-gray-900">No containers found</div>
					</td>
				  </tr>
				{/each}
			</tbody>
		  </table>
		</div>
	  </div>
	</div>
  </div>
  