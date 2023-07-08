import { error, redirect } from "@sveltejs/kit";
import { getDb } from "$lib/db";
import { EntityId } from "shared/models/base";
import { countResponsesByInstanceId, getResponsesGroupedByInstanceId } from "db/responses";
import type { PageServerLoad } from "./$types";
import { getSurveyInfoById } from "db/surveys";
import { ResponsesFilters } from "shared/models/response";

export const load = (async ({ url, params }) => {
	const surveyId = EntityId.parse(params.surveyId);
	const page = +(url.searchParams.get("page") || 1);
	const pageSize = +(url.searchParams.get("pageSize") || 25);

	const filters = ResponsesFilters.parse({
		receivedFrom: url.searchParams.has("from")
			? new Date(+url.searchParams.get("from")!)
			: undefined,
		receivedTo: url.searchParams.has("to") ? new Date(+url.searchParams.get("to")!) : undefined,
		tags: url.searchParams.get("tags")?.split(",") || [],
	});
	const appliedFilters: Required<ResponsesFilters> = {
		receivedFrom: filters.receivedFrom || new Date(0), //from the beginning of time
		receivedTo: filters.receivedTo || new Date(), //until now
		tags: filters.tags || [],
	};

	console.log("LOADING RESPONSES FOR SURVEY", surveyId, "PAGE", page, "PAGE SIZE", pageSize);
	try {
		console.log("QUERYING RESPONSES...");
		const db = await getDb();
		const results = Promise.all([
			await getSurveyInfoById(db, surveyId),
			await getResponsesGroupedByInstanceId(db, surveyId, appliedFilters, page, pageSize),
			await countResponsesByInstanceId(db, surveyId, appliedFilters),
		]);
		const [surveyInfo, responses, count] = await results;

		console.log("COUNTE ALL", count);

		return {
			responses: responses,
			survey: surveyInfo,
			countAll: count,
			page: page,
			pageSize: pageSize,
			filters: filters,
		};
	} catch (e) {
		console.error(e);
		return error(500, "Unable to load survey responses!");
	}
}) satisfies PageServerLoad;
