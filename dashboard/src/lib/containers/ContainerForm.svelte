<script lang="ts">
	import { Container } from "shared/models/container";
	import { createEventDispatcher } from "svelte";

	export let container: Container | undefined = undefined;
	const dispatch = createEventDispatcher<{
		save: Container;
	}>();

	const saveContainer = async (newContainer: Container) => {
		console.log("SAVE CONTAINER");
		const isEdit = !!container;

		const res = await fetch(isEdit ? `/api/containers/${container?.id}` : "/api/containers", {
			method: isEdit ? "PUT" : "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newContainer),
		});

		console.log("SAVE RESPONSE", res.status, res);
		if (res.ok) {
			dispatch("save", newContainer);
		} else {
			console.error("Failed to save container", res);
		}
	};

	const onSubmit = async (e: Event) => {
		console.log("submit");
		const data = new FormData(e.target as HTMLFormElement);

		console.log(Object.fromEntries(data.entries()));

		const newContainer = Container.parse(Object.fromEntries(data.entries()));
		await saveContainer(newContainer);
	};
</script>

<div class="flex flex-col gap-2 h-full">
	<form method="post" class="contents" on:submit|preventDefault={onSubmit}>
		<label for="name" class="block w-full leading-6 text-slate-700 mt-4">Container name</label>
		<input
			type="text"
			name="name"
			id="name"
			required
			placeholder="Cool container"
			class="field-std"
			value={container?.name || ""}
		/>
		<label for="domain" class="block w-full leading-6 text-slate-700 mt-4"
			>Domain <i class="fa-regular fa-circle-question text-fuchsia-500 cursor-pointer" /></label
		>
		<input
			type="text"
			name="domain"
			id="domain"
			required
			placeholder="blog.mydomain.com"
			class="field-std"
			value={container?.domain || ""}
		/>
		<label for="description" class="block w-full leading-6 text-slate-700 mt-4">Description</label>
		<textarea
			name="description"
			id="description"
			required
			class="field-std h-32"
			value={container?.description || ""}
		/>
		<button type="submit" class="btn-primary self-center w-1/3">Save</button>
	</form>
</div>
