<script lang="ts">
	export let breadCrumbs: { name: string; href?: string }[] = [];
</script>

<div class="flex flex-row justify-start items-center">
	<header
		class="flex flex-row justify-center items-center gap-4 py-2 px-4 bg-white shadow-md m-4 border border-slate-100 rounded-md self-start"
	>
		<nav class="flex gap-1 items-center">
			<a href="/" class="text-slate-900">
				<svg
					class="h-5 w-5 flex-shrink-0"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="sr-only">Home</span>
			</a>
			{#each breadCrumbs as crumb}
				<svg
					class="h-5 w-5 flex-shrink-0 text-slate-300"
					fill="currentColor"
					viewBox="0 0 20 20"
					aria-hidden="true"
				>
					<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
				</svg>
				{#if crumb.href}
					<a href={crumb.href} class="text-sm font-medium text-slate-600 hover:text-slate-900"
						>{crumb.name}</a
					>
				{:else}
					<span class="font-bold text-sm text-slate-900" aria-current="page">{crumb.name}</span>
				{/if}
			{/each}
		</nav>

		<slot />
	</header>
</div>
