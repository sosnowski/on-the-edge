import { writable } from "svelte/store";

export type Status = {
	message: string;
	type: "success" | "error" | "loading" | "info";
	timeout?: number;
};

export const status = writable<Status | null>(null);

export const success = (message: string, timeout?: number): Status => {
	return {
		message,
		type: "success",
		timeout,
	};
};

export const error = (message: string, timeout?: number): Status => {
	return {
		message,
		type: "error",
		timeout,
	};
};

export const loading = (message: string, timeout?: number): Status => {
	return {
		message,
		type: "loading",
		timeout,
	};
};

export const info = (message: string, timeout?: number): Status => {
	return {
		message,
		type: "info",
		timeout,
	};
};

status.subscribe((value) => {
	console.log("status changed", value);
	if (value?.timeout) {
		console.log("Status timeout", value.timeout);
		setTimeout(() => {
			console.log("Status timeout expired");
			status.set(null);
		}, value.timeout);
	}
});
