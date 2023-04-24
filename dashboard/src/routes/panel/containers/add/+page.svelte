<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from "../$types";

	export let form: ActionData;

	console.log(form);
</script>

<div class="container mx-auto h-full">
	{#if form && form.success}
	<div class="flex flex-col gap-2 bg-white p-8 rounded-md mx-auto shadow-md my-8 max-w-[40rem]">
		<h1 class="text-green-500">Container added</h1>
		<p class="text-slate-700">You can now add items to this container.</p>
		<a href="/panel/containers" class="btn-std w-auto self-center bg-fuchsia-500 text-white hover:bg-fuchsia-300">Go to containers</a>
	</div>
	{:else}
	<div class="flex flex-col gap-2 bg-white p-8 rounded-md mx-auto shadow-md my-8 max-w-[40rem]">
		<h1>Add new container</h1>
		<form method="post" action="/panel/containers/add" class="contents" use:enhance>
			<label for="name" class="block text-sm leading-6 text-slate-700">Container name</label>
			<input
				type="text"
				name="name"
				id="name"
				required
				placeholder="Cool container"
				class="block w-full rounded-md border-0 py-1.5 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-400 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-fuchsia-600 sm:text-sm sm:leading-6"
			>
			<label for="description" class="block text-sm leading-6 text-slate-700">Description</label>
			<textarea name="description" id="description"
			required
			class="block w-full h-32 rounded-md border-0 py-1.5 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-400 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-fuchsia-600 sm:text-sm sm:leading-6"
			></textarea>
			<button type="submit" class="btn-primary self-center">Save</button>
		</form>
	</div>
	{/if}
</div>


