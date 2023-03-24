import { nanoid } from "nanoid";
import { ContainerInfo, EntityId, SurveyMetadata } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    const containerId = EntityId.parse(+request.params["containerId"]);
    const userToken = (request.query["userToken"] as string) || nanoid(30);
    const sessionToken =
        (request.query["sessionToken"] as string) || nanoid(30);

    const surveysMeta = await env.KV.list<SurveyMetadata>({
        prefix: `Container:${containerId}:Survey:`,
    });

    console.log("GOT KEYS!");
    console.log(surveysMeta);

    const surveys = surveysMeta.keys
        .filter(({ name, metadata }) => {
            return metadata && metadata.status === "active";
        })
        .map(({ name, metadata }) => {
            const surveyId = name.split(":").splice(-1, 1)[0];
            return metadata!;
        });

    const containerInfo: ContainerInfo = {
        userToken: userToken,
        sessionToken: sessionToken,
        surveys: surveys,
    };

    return new Response(JSON.stringify(containerInfo));
};
