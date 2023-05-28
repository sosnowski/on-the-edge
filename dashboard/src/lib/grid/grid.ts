import type { SvelteComponent } from "svelte";

export type Column = {
	label: string;
	field: string;
	cmp?: any;
};

export type CellAction = {
	name: string;
	detail?: unknown;
};

export type GridAction = {
	name: string;
	record: Record<string, unknown>;
	column: Column;
	detail?: unknown;
};
