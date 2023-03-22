import { SurveyEvent } from "shared/models/survey";
import { getDb } from "db/client";
import { Env } from "./env";
import { handleEvents } from "./handler";

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        console.log("EVENTS CONSUMER!");

        const db = await getDb({
            host: env.DB_HOST,
            username: env.DB_USER,
            password: env.DB_PASSWORD,
        });

        const payload = await request.json();

        if (!Array.isArray(payload)) {
            return new Response("Invalid payload", { status: 400 });
        }
        const events = payload.map((e) => SurveyEvent.parse(e));
        await handleEvents(db, events);
        return new Response("Great success!");
    },
};
