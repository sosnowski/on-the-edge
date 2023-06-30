<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Cell from "./Cell.svelte";
	import ColumnCmp from "./Column.svelte";
	import type { CellAction, Column, Filters, GridAction } from "./grid";
	import FiltersPanel from "./FiltersPanel.svelte";

	export let columns: Column<any>[];
	export let data: Record<string, unknown>[];
	export let keyField: string;
	export let allRecords: number;
	export let page: number;
	export let pageSize: number = 25;
	export let filters: Filters;

	const dispatch = createEventDispatcher<{
		page: number;
		action: GridAction<any, any>;
		filters: Filters;
	}>();

	$: numOfPages = Math.ceil(allRecords / pageSize);

	const changePage = (page: number) => {
		if (page < 1 || page > numOfPages) return;
		console.log("Set page " + page);
		dispatch("page", page);
	};

	const onColumnAction = (event: CustomEvent<GridAction>) => {
		console.log("Grid On Column Action", event.detail);
		dispatch("action", event.detail);
	};

	const onFiltersUpdate = (event: CustomEvent<Filters>) => {
		console.log("Grid On Filters Update", event.detail);
		dispatch("filters", event.detail);
	};
</script>

<div class="w-full flex flex-col gap-2">
	<FiltersPanel on:update={onFiltersUpdate} activeFilters={filters} />
	<div class="flex flex-col w-full h-full bg-white rounded-md shadow-md">
		<div class="flex-1 overflow-auto">
			<table class="border border-slate-100 min-w-full">
				<thead>
					<tr>
						{#each columns as column (column.id)}
							<th
								class="border border-slate-100 px-4 py-2 truncate font-normal"
								title={column.label}>{column.label}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data as record, index (record[keyField])}
						<tr>
							{#each columns as column (column.id)}
								<ColumnCmp
									{column}
									{record}
									{index}
									on:action={onColumnAction}
									let:column
									let:record
									let:value
									let:onCellAction
								>
									<svelte:component
										this={column.cmp || Cell}
										{column}
										{record}
										{value}
										on:action={onCellAction}
									/>
								</ColumnCmp>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<div
		class="mt-auto flex items-center justify-between bg-white rounded-md shadow-md px-4 py-3 sm:px-6"
	>
		<div class="flex flex-1 justify-between sm:hidden">
			<button class="btn-std">Previous</button>
			<button class="btn-std">Next</button>
		</div>
		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			<div>
				<p class="text-sm text-gray-700">
					Showing
					<span class="font-medium">{(page - 1) * pageSize + 1}</span>
					to
					<span class="font-medium">{(page - 1) * pageSize + data.length}</span>
					of
					<span class="font-medium">{allRecords}</span>
					results
				</p>
			</div>
			<div>
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<button
						class="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						class:text-slate-200={page === 1}
						class:cursor-default={page === 1}
						class:hover:bg-white={page === 1}
						on:click={() => changePage(page - 1)}
					>
						<span class="sr-only">Previous</span>
						<i class="fa-solid fa-chevron-left" />
					</button>
					{#each Array(numOfPages) as _, i}
						<button
							aria-current="page"
							class="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
							class:bg-fuchsia-500={i + 1 === page}
							class:text-white={i + 1 === page}
							on:click={() => changePage(i + 1)}
						>
							{i + 1}
						</button>
					{/each}
					<!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
					<button
						class="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						class:text-slate-200={numOfPages === 1}
						class:cursor-default={numOfPages === 1}
						on:click={() => changePage(page + 1)}
					>
						<span class="sr-only">Next</span>
						<i class="fa-solid fa-chevron-right" />
					</button>
				</nav>
			</div>
		</div>
	</div>
</div>
