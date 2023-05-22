//import zod
import { z } from "zod";
import { EntityId, Token } from "./base";
export * from "./base";

const Event = z.object({
	surveyId: EntityId,
	instanceId: z.string(),
	userToken: Token,
});

export const SurveyResponse = Event.extend({
	questionId: EntityId,
	content: z.string().nullable(),
});

export const ActionType = z.enum(["open", "finish"]);

export const ActionEvent = Event.extend({
	type: z.literal("action"),
	action: ActionType,
});

export const UserImpression = z.object({
	userToken: Token,
	surveyId: EntityId,
	created: z.coerce.date(),
});

// export const SurveyEvent = z.union([ResponseEvent, ActionEvent]);

export type SurveyResponse = z.infer<typeof SurveyResponse>;
export type ActionType = z.infer<typeof ActionType>;
export type ActionEvent = z.infer<typeof ActionEvent>;
// export type SurveyEvent = z.infer<typeof SurveyEvent>;
export type UserImpression = z.infer<typeof UserImpression>;
