import { error } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId } from "shared/models/base";
import { getSurveyStats, getSurveyTimeline } from "db/events";
import type { PageServerLoad } from "./$types";
import { getSurveyById } from "db/surveys";
import { formatDateToInput } from "$lib/helpers";
import type { SurveyTimelineEntry } from "shared/models/stats";

export const load = (async ({ params, url }) => {
	const surveyId = EntityId.parse(params.surveyId);
	const daysRange = url.searchParams.has("range") ? +url.searchParams.get("range")! : 15;

	try {
		console.log("Get survey stats");
		const db = await getDb();

		const [survey, stats, timeline] = await Promise.all([
			getSurveyById(db, surveyId),
			getSurveyStats(db, surveyId),
			getSurveyTimeline(db, surveyId, daysRange),
		]);

		console.log("Survey stats", stats);
		console.log("Survey timeline", timeline);

		const fullTimeline: SurveyTimelineEntry[] = [];
		const now = new Date();
		let currentDate = new Date(
			new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
				(daysRange - 1) * 24 * 60 * 60 * 1000,
		);

		while (currentDate <= now) {
			const day = formatDateToInput(currentDate);

			const entry = timeline.find((e) => formatDateToInput(e.day) === day);
			fullTimeline.push({
				day: currentDate,
				surveysDisplayed: entry?.surveysDisplayed ?? 0,
				surveysResponded: entry?.surveysResponded ?? 0,
				surveysCompleted: entry?.surveysCompleted ?? 0,
			});
			currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
		}

		console.log("Full timeline", fullTimeline);

		return {
			survey: survey,
			stats: stats,
			timeline: fullTimeline,
			range: daysRange,
		};
	} catch (err) {
		console.error(err);
		throw error(500, "Internal server error");
	}
}) satisfies PageServerLoad;
