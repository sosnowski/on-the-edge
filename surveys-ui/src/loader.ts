import type { SurveyInfo, SurveyMetadata } from "shared/models/survey";
import type { SurveyResponse } from "shared/models/response";
import type { ContainerInfo } from "shared/models/container";

export const loadSurveys = async (
    containerId: string,
    surveysMeta: SurveyMetadata[]
): Promise<SurveyInfo[]> => {
    console.log(`Loading survey for ${containerId}`);

    const loadingSurveys = surveysMeta
        .filter((survey) => {
            return true; //later filter based on type of survey etc.
        })
        .map((survey) => {
            return fetch(
                `http://localhost:8787/container/${containerId}/surveys/${survey.surveyId}`,
                {
                    method: "GET",
                }
            );
        });

    const results = await Promise.all(loadingSurveys);

    return Promise.all(
        results.map((resp) => {
            if (!resp.ok) {
                console.error(resp.statusText);
                throw new Error("Unable to load surveys! " + resp.url);
            }
            return resp.json();
        })
    );
};

export const loadContainerInfo = async (
    containerId: string,
    userToken?: string,
    sessionToken?: string
): Promise<ContainerInfo> => {
    console.log(
        "Loading Surveys for Workspace " +
            containerId +
            "..." +
            userToken +
            "..." +
            sessionToken
    );
    const url = new URL(`http://localhost:8787/container/${containerId}`);
    if (userToken) {
        url.searchParams.append("userToken", userToken);
    }
    if (sessionToken) {
        url.searchParams.append("sessionToken", sessionToken);
    }
    const resp = await fetch(url.toString(), {
        method: "GET",
    });

    if (!resp.ok) {
        console.error(resp.statusText);
        throw new Error("Unable to load surveys! Http Status: " + resp.status);
    }

    console.log("Surveys loaded, status: " + resp.status);

    return resp.json();
};

export const postResponse = async (
    surveyId: number,
    userToken: string,
    sessionToken: string,
    responses: SurveyResponse[]
): Promise<void> => {
    console.log(`Sending response for`, responses);

    const resp = await fetch(
        `http://localhost:8787/surveys/${surveyId}/event`,
        {
            method: "POST",
            body: JSON.stringify({
                type: "response",
                userToken: userToken,
                sessionToken: sessionToken,
                responses: responses,
            }),
        }
    );

    if (!resp.ok) {
        console.error("Unable to save the response!");
        throw new Error();
    }
};
