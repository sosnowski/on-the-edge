import type { SvelteComponent } from "svelte";

export type Column<T = Record<string, unknown>, D = Record<string, unknown>> = {
	label: string;
	get: (record: T, index: number) => unknown;
	cmp?: any;
	id: string;
	data?: D;
};

export type CellAction<T = unknown> = {
	name: string;
	detail?: T;
};

export type GridAction<T = Record<string, unknown>, D = unknown> = {
	name: string;
	record: T;
	column: Column<T>;
	detail?: D;
};
