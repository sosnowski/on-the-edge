export type RouterRequest = Request & {
	params: {
		[key: string]: string;
	};
	query: {
		[key: string]: string | string[] | undefined;
	};
};
