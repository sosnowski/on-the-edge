import { SurveyEvent } from "shared/models/survey";
import { Env } from "../env";
import { RouterRequest } from "../router";

const sendEvenToQueue = async (
    queue: Fetcher,
    request: Request,
    event: SurveyEvent
): Promise<void> => {
    console.log("Sending event to Fetcher!");
    const res = await queue.fetch(request.clone());

    console.log("Sent with status " + res.status);

    if (!res.ok) {
        console.error("Unable to send event to queue!!");
        console.log(res.status);
    }
    return;
};

export const handler = async (
    request: RouterRequest,
    env: Env
): Promise<Response> => {
    if (!request.params["surveyId"]) {
        return new Response("Mssing suveyId param", { status: 400 });
    }
    console.log("Sending to the Events Queue!");
    const event = await request.json<any>();
    event.surveyId = +request.params["surveyId"];

    const newPayload = JSON.stringify([event]);
    const res = await env.EVENTS_QUEUE.fetch(
        new Request(request.url, {
            headers: {
                ...request.headers,
                "content-length": `${newPayload.length}`,
            },
            method: request.method,
            body: newPayload,
        })
    );

    console.log("After Promise");
    console.log("Worker Response!");
    console.log("Status: " + res.status);
    return new Response(res.statusText, { status: res.status });

    // const payload = await request.json<any>();
    // payload.surveyId = request.params["surveyId"];

    // const event = SurveyEvent.parse(payload);
    // switch (event.type) {
    //     case "response":
    //         console.log("Received responses for Survey " + event.surveyId);
    //         console.log(JSON.stringify(event, undefined, 4));
    //         console.log("Sending to the Queue...");

    //         console.log("... Done");
    //         return res;
    //     default:
    //         return new Response("Invalid event name", { status: 400 });
    // }
};
