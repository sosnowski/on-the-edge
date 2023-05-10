import type { EntityId, SurveyInfo } from "shared/models/survey";
import { SURVEYS_API_URL } from "$env/static/private";

export const publishSurvey = async (containerId: EntityId, survey: SurveyInfo): Promise<void> => {
	const url = `${SURVEYS_API_URL}/containers/${containerId}/surveys`;

	console.log("Publishing survey to", url);

	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(survey),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to publish survey: ${res.status} ${res.statusText}`);
	}
};

export const unpublishSurvey = async (containerId: EntityId, surveyId: EntityId): Promise<void> => {
	const url = `${SURVEYS_API_URL}/containers/${containerId}/surveys/${surveyId}`;

	const res = await fetch(url, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error(`Failed to unpublish survey: ${res.status} ${res.statusText}`);
	}
};
