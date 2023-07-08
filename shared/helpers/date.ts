export const formatDateTime = (date?: Date) => {
	if (!date) return "";
	return `${date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})}, ${date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
};

export const formatDate = (date?: Date) => {
	if (!date) return "";
	return date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatDateToInput = (date?: Date) => {
	if (!date) return "";
	return date.toISOString().slice(0, 10);
};
