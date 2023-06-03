import type { SvelteComponent } from "svelte";

export type Column<T = Record<string, unknown>> = {
	label: string;
	get: (record: T, index: number) => unknown;
	cmp?: any;
	id: string;
};

export type CellAction = {
	name: string;
	detail?: unknown;
};

export type GridAction<T = Record<string, unknown>> = {
	name: string;
	record: Record<string, unknown>;
	column: Column<T>;
	detail?: unknown;
};
