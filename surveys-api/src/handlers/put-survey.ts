import {
    EntityId,
    SurveyInfo,
    SurveyMetadata,
} from "shared/models/surveys/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    const containerId = EntityId.parse(+request.params["containerId"]);

    const payload = await request.json();
    const survey: SurveyInfo = SurveyInfo.parse(payload);

    const KVKey = `Container:${containerId}:Survey:${survey.surveyId}`;

    await env.KV.put(KVKey, JSON.stringify(survey), {
        metadata: {
            surveyId: survey.surveyId,
            type: survey.type,
            display: survey.display,
            status: survey.status,
            triggerConfig: survey.triggerConfig,
        } satisfies SurveyMetadata,
    });

    return new Response("");
};
