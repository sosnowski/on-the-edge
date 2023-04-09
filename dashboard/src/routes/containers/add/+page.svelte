<script lang="ts">
	import type { ActionData } from "../$types";

	export let form: ActionData;

	console.log(form);
</script>


<div class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
	{#if form?.success && form?.container}
		<p class="text-center">Container saved!</p>
		<p><a href={`/containers/${form.container.id}/surveys`}>Open Container</a></p>
	{:else}
	<form method="post" action="/containers/add">
		<div class="mt-3 text-center sm:mt-5">
			<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Add new container</h3>
			<div class="mt-2">
				
				<label for="name" class="block text-sm font-medium leading-6 text-gray-900">Container name</label>
					<div class="mt-2">
					<input type="text" name="name" id="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Cool container">
					</div>
			</div>
			<div class="mt-2">
				<label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
				<div class="mt-2">
				  <textarea rows="4" name="description" id="description" class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"></textarea>
				</div>
			  </div>
		</div>
		
		<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
			<button type="submit" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Save</button>
		</div>

	</form>
{/if}
</div>