/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { SurveyEvent } from "shared/models/survey";
import { Router, IRequest } from "itty-router";
import { Env } from "./env";
import { handler as putSurveyHandler } from "./handlers/put-survey";
import { handler as getContainerInfo } from "./handlers/get-container";
import { handler as getSurveyHandler } from "./handlers/get-survey";
import { handler as putSurveyEvent } from "./handlers/put-event";
import { handler as deleteSurveys } from "./handlers/delete-surveys";

const router = Router();

router
    .post("/container/:containerId/surveys", putSurveyHandler as any)
    .get("/container/:containerId", getContainerInfo as any)
    .delete("/container/:containerId/surveys", deleteSurveys as any)
    .get("/container/:containerId/surveys/:surveyId", getSurveyHandler as any)

    .post(
        "/container/:containerId/surveys/:surveyId/event",
        putSurveyEvent as any
    )

    .all("*", () => {
        console.log("Error 404");
        return new Response("404");
    });

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        let resp: Response;
        try {
            resp = await router.handle(request, env, ctx);
        } catch (e) {
            resp = new Response(JSON.stringify(e));
        }
        resp.headers.set("Access-Control-Allow-Origin", "*");
        resp.headers.set("Access-Control-Allow-Methods", "*");
        resp.headers.set("Access-Control-Allow-Headers", "*");
        return resp;
    },
};
