import type { SurveyInfo, Token } from "shared/models/survey";
import type { SurveyResponse } from "shared/models/response";
import type { ContainerInfo } from "shared/models/container";

export const loadSurvey = async (
	userToken: Token,
	containerId: string,
	surveyId: string,
): Promise<SurveyInfo | null> => {
	console.log(`Loading survey for ${containerId}`);

	const resp = await fetch(`http://localhost:8787/containers/${containerId}/surveys/${surveyId}`, {
		method: "GET",
		headers: {
			"x-user-token": userToken,
		},
	});

	if (!resp.ok) {
		console.error(resp.statusText);
		throw new Error("Unable to load surveys! " + resp.url);
	}

	if (resp.status === 204) {
		return null;
	}

	return resp.json();
};

export const loadContainerInfo = async (
	userToken: Token,
	containerId: string,
): Promise<ContainerInfo> => {
	console.log("Loading Surveys for Workspace " + containerId);
	const url = new URL(`http://localhost:8787/containers/${containerId}`);
	const resp = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"x-user-token": userToken,
		},
	});

	if (!resp.ok) {
		console.error(resp.statusText);
		throw new Error("Unable to load surveys! Http Status: " + resp.status);
	}

	console.log("Surveys loaded, status: " + resp.status);
	console.log("Survey loaded with user token " + resp.headers.get("x-user-token"));

	const containerInfo = await resp.json();

	return {
		...containerInfo,
		userToken: resp.headers.get("x-user-token"),
	};
};

export const postResponse = async (
	userToken: Token,
	surveyId: string,
	instanceId: string,
	response: SurveyResponse,
): Promise<void> => {
	console.log(`Sending response`, response);

	const surveyResponse: SurveyResponse = {
		surveyId: surveyId,
		instanceId: instanceId,
		questionId: response.questionId,
		content: response.content,
	};

	const resp = await fetch(`http://localhost:8787/surveys/${surveyId}/responses`, {
		method: "POST",
		body: JSON.stringify(surveyResponse),
		headers: {
			"x-user-token": userToken,
			"content-type": "application/json",
		},
	});

	if (!resp.ok) {
		console.error("Unable to save the response!", resp.statusText);
		throw new Error("Ubable to save the response!");
	}
};

export const postDisplayedEvent = async (
	userToken: Token,
	surveyId: string,
	instanceId: string,
): Promise<void> => {
	const resp = await fetch(`http://localhost:8787/surveys/${surveyId}/events`, {
		method: "POST",
		headers: {
			"x-user-token": userToken,
		},
		body: JSON.stringify({
			instanceId: instanceId,
			type: "displayed",
		}),
	});

	if (!resp.ok) {
		console.error("Unable to save the displayed event!", resp.statusText);
		throw new Error("Unable to save the displayed event!");
	}
};

export const postRespondedEvent = async (
	userToken: Token,
	surveyId: string,
	instanceId: string,
	response: SurveyResponse,
): Promise<void> => {
	console.log("POST RESPONDED EVENT");
	console.log(
		JSON.stringify({
			questionId: response.questionId,
			instanceId: instanceId,
			type: "responded",
		}),
	);
	const resp = await fetch(`http://localhost:8787/surveys/${surveyId}/events`, {
		method: "POST",
		headers: {
			"x-user-token": userToken,
		},
		body: JSON.stringify({
			questionId: response.questionId,
			instanceId: instanceId,
			type: "responded",
		}),
	});

	if (!resp.ok) {
		console.error("Unable to save the responded event!", resp.statusText);
		throw new Error("Ubable to save the responded event!");
	}
};

export const postCompletedEvent = async (
	userToken: Token,
	surveyId: string,
	instanceId: string,
): Promise<void> => {
	const resp = await fetch(`http://localhost:8787/surveys/${surveyId}/events`, {
		method: "POST",
		headers: {
			"x-user-token": userToken,
		},
		body: JSON.stringify({
			instanceId: instanceId,
			type: "completed",
		}),
	});

	if (!resp.ok) {
		console.error("Unable to save the finished event!", resp.statusText);
		throw new Error("Ubable to save the finished event!");
	}
};
