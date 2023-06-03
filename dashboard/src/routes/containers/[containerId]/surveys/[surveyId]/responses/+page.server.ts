import { error, redirect } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId } from "shared/models/base";
import { countResponsesByInstanceId, getResponsesGroupedByInstanceId } from "db/responses";
import type { PageServerLoad } from "./$types";
import { getSurveyInfoById } from "db/surveys";

export const load = (async ({ url, params }) => {
	const containerId = EntityId.parse(params.containerId);
	const surveyId = EntityId.parse(params.surveyId);
	const page = +(url.searchParams.get("page") || 1);
	const pageSize = +(url.searchParams.get("pageSize") || 25);

	console.log("LOADING RESPONSES FOR SURVEY", surveyId, "PAGE", page, "PAGE SIZE", pageSize);
	try {
		console.log("QUERYING RESPONSES...");
		const db = await getDb();
		const results = Promise.all([
			await getSurveyInfoById(db, surveyId),
			await getResponsesGroupedByInstanceId(db, surveyId, page, pageSize),
			await countResponsesByInstanceId(db, surveyId),
		]);
		const [surveyInfo, responses, count] = await results;

		console.log("COUNTE ALL", count);

		return {
			responses: responses,
			survey: surveyInfo,
			countAll: count,
			page: page,
			pageSize: pageSize,
		};
	} catch (e) {
		console.error(e);
		return error(500, "Unable to load survey responses!");
	}
}) satisfies PageServerLoad;
