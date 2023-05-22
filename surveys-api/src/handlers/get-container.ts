import { nanoid } from "nanoid";
import { EntityId, Token } from "shared/models/base";
import type { ContainerInfo } from "shared/models/container";
import { Env } from "../env";
import { RouterRequest } from "../router";
import { getImpressionsForUser, getSurveysMetaForContainer } from "../store";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	let containerId;
	try {
		containerId = EntityId.parse(request.params["containerId"]);
	} catch (e) {
		console.error(e);
		return new Response("Invalid container id", { status: 400 });
	}

	let userToken: Token | undefined = undefined;
	if (request.headers.get("x-user-token")) {
		console.log("User token found in request");
		userToken = Token.parse(request.headers.get("x-user-token")!);
	}

	let surveys = await getSurveysMetaForContainer(env, containerId);
	console.log(`Found ${surveys.length} surveys for container`);
	if (userToken) {
		console.log("Received valid user token, removing surveys user has already seen");

		const impressions = await Promise.all(
			surveys.map(async (survey) => {
				if (survey.triggerConfig.limit === "user") {
					console.log("Getting impressions for survey " + survey.surveyId);
					return getImpressionsForUser(env, survey.surveyId, userToken!);
				} else {
					return [];
				}
			}),
		);
		surveys = surveys.filter((survey, index) => {
			console.log("User has seen survey " + impressions[index].length + " times");
			return impressions[index].length === 0;
		});
	}

	console.log("GOT KEYS!");
	console.log(surveys);

	const containerInfo: Partial<ContainerInfo> = {
		surveys: surveys,
	};

	return new Response(JSON.stringify(containerInfo), {
		headers: {
			"content-type": "application/json",
			"x-user-token": userToken || nanoid(40),
		},
	});
};
