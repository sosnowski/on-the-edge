export const formatDate = (data?: Date) => {
	if (!data) return "";
	const date = new Date(data);
	return `${date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})}, ${date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
};
