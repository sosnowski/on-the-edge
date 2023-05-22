import { EntityId, SurveyInfo, SurveyMetadata, Token } from "shared/models/survey";
import { Env } from "./env";
import { UserImpression } from "shared/models/response";

export const getSurveysMetaForContainer = async (
	env: Env,
	containerId: EntityId,
): Promise<SurveyMetadata[]> => {
	const surveysMeta = await env.KV.list<SurveyMetadata>({
		prefix: `SURVEY#Container:${containerId}`,
	});

	return surveysMeta.keys.map(({ name, metadata }) => {
		return metadata!;
	});
};

export const saveSurvey = async (env: Env, surveyInfo: SurveyInfo): Promise<void> => {
	const key = `SURVEY#Container:${surveyInfo.containerId}#Survey:${surveyInfo.id}`;

	await env.KV.put(key, JSON.stringify(surveyInfo), {
		metadata: {
			surveyId: surveyInfo.id!,
			displayType: surveyInfo.displayType,
			status: surveyInfo.status,
			triggerConfig: surveyInfo.triggerConfig,
		} satisfies SurveyMetadata,
	});
};

export const getSurvey = async (
	env: Env,
	containerId: EntityId,
	surveyId: EntityId,
): Promise<SurveyInfo | null> => {
	const key = `SURVEY#Container:${containerId}#Survey:${surveyId}`;
	const data = await env.KV.get(key, "json");

	if (!data) {
		return null;
	}

	return SurveyInfo.parse(data);
};

// if survey is per session, check if user in this session has seen it
// if survey is per user, check if user has seen it in any session

export const getImpressionsForSurvey = async (
	env: Env,
	surveyId: EntityId,
): Promise<UserImpression[]> => {
	const res = await env.KV.list<UserImpression>({
		prefix: `IMPRESSION#Survey:${surveyId}`,
	});

	return res.keys.map(({ name, metadata }) => {
		return metadata!;
	});
};

export const getImpressionsForUser = async (
	env: Env,
	surveyId: EntityId,
	userToken: Token,
): Promise<UserImpression[]> => {
	console.log(
		"Looking for impressions with prefix: " + `IMPRESSIONS#Survey:${surveyId}#User:${userToken}`,
	);
	const res = await env.KV.list<UserImpression>({
		prefix: `IMPRESSIONS#Survey:${surveyId}#User:${userToken}`,
	});

	console.log("Found " + res.keys.length + " impressions");

	return res.keys.map(({ name, metadata }) => {
		return metadata!;
	});
};

export const saveUserImpression = async (
	env: Env,
	surveyId: EntityId,
	userToken: string,
): Promise<UserImpression> => {
	const userSession: UserImpression = {
		userToken,
		surveyId,
		created: new Date(),
	};

	await env.KV.put(
		`IMPRESSIONS#Survey:${surveyId}#User:${userToken}`,
		JSON.stringify(userSession),
		{
			metadata: userSession,
			expirationTtl: 60 * 60 * 24, // 1 day, to test TODO change for more
		},
	);

	return userSession;
};

export const deleteSurveyImpressions = async (env: Env, surveyId: EntityId): Promise<void> => {
	const impressions = await getImpressionsForSurvey(env, surveyId);

	await Promise.all(
		impressions.map((impression) => {
			return env.KV.delete(`IMPRESSIONS#Survey:${surveyId}#User:${impression.userToken}`);
		}),
	);
};
