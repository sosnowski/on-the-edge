import { nanoid } from "nanoid";
import { EntityId } from "shared/models/base";
import type { SurveyMetadata } from "shared/models/survey";
import type { ContainerInfo } from "shared/models/container";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (request: RouterRequest, env: Env): Promise<Response> => {
	console.log("LOAD CONTAINER INFO");
	const containerId = EntityId.parse(request.params["containerId"]);
	const userToken = (request.query["userToken"] as string) || nanoid(30);
	const sessionToken = (request.query["sessionToken"] as string) || nanoid(30);

	const surveysMeta = await env.KV.list<SurveyMetadata>({
		prefix: `Container:${containerId}:Survey:`,
	});

	console.log("GOT KEYS!");
	console.log(surveysMeta);

	const surveys = surveysMeta.keys.map(({ name, metadata }) => {
		return metadata!;
	});

	const containerInfo: ContainerInfo = {
		userToken: userToken,
		sessionToken: sessionToken,
		surveys: surveys,
	};

	return new Response(JSON.stringify(containerInfo));
};
