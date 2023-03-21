import type {
    EntityId,
    Response,
    Survey,
    SurveyConfig,
} from "shared/models/survey";

export const loadSurvey = async (
    containerId: string,
    surveyId: string
): Promise<Survey> => {
    console.log(`Loading survey for ${containerId}/${surveyId}`);

    const resp = await fetch(
        `http://localhost:8787/container/${containerId}/surveys/${surveyId}`,
        {
            method: "GET",
        }
    );

    if (!resp.ok) {
        console.error(resp.statusText);
        throw new Error("Unable to load survey! Http Status: " + resp.status);
    }

    console.log("Surveys loaded, status: " + resp.status);

    return resp.json();
};

export const loadSurveys = async (containerId: string): Promise<Survey[]> => {
    console.log("Loading Surveys for Workspace " + containerId);
    const resp = await fetch(
        `http://localhost:8787/container/${containerId}/surveys`,
        {
            method: "GET",
        }
    );
    console.log(resp);
    if (!resp.ok) {
        console.error(resp.statusText);
        throw new Error("Unable to load surveys! Http Status: " + resp.status);
    }

    console.log("Surveys loaded, status: " + resp.status);

    const surveysConfigs: Record<EntityId, SurveyConfig> = await resp.json();
    console.log("Surveys configs", surveysConfigs);
    //surveys loaded now filter those that were already shown to the user / session and load details of remaining ones
    const surveys = Promise.all(
        Object.entries(surveysConfigs).map(([key, _config]) => {
            //filter surveys
            return loadSurvey(containerId, key);
        })
    );

    return surveys;
};

export const postResponse = async (
    surveyId: string,
    userId: string,
    responses: Response[]
): Promise<void> => {
    console.log(`Sending response for`, responses);

    const resp = await fetch(
        `http://localhost:8787/surveys/${surveyId}/event`,
        {
            method: "POST",
            body: JSON.stringify({
                type: "response",
                userId: userId,
                responses: responses,
            }),
        }
    );

    if (!resp.ok) {
        console.error("Unable to save the response!");
        throw new Error();
    }
};
