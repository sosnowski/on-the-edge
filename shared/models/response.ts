//import zod
import { z } from "zod";
import { EntityId, Token } from "./base";
export * from "./base";

const Event = z.object({
	surveyId: EntityId,
	instanceId: z.string(),
	userToken: Token,
	created: z.coerce.date().optional(),
	updated: z.coerce.date().optional(),
});

export const SurveyResponse = Event.extend({
	id: z.number().optional(),
	questionId: EntityId,
	content: z.string().nullable(),
});

export const SurveyDisplayedEvent = Event.extend({
	type: z.literal("displayed"),
});

export const SurveyRespondedEvent = Event.extend({
	type: z.literal("responded"),
	questionId: EntityId,
});

export const SurveyCompletedEvent = Event.extend({
	type: z.literal("completed"),
});

export const SurveyEvent = z.union([
	SurveyDisplayedEvent,
	SurveyRespondedEvent,
	SurveyCompletedEvent,
]);

export const UserImpression = z.object({
	userToken: Token,
	surveyId: EntityId,
	created: z.coerce.date(),
});

export const Tag = z.object({
	id: EntityId.optional(),
	label: z.string(),
	color: z.string(),
});

export const ResponseDetails = SurveyResponse.pick({
	questionId: true,
	content: true,
	id: true,
}).extend({
	tags: z.array(EntityId).optional().nullable(),
});

export const ResponsesByInstance = z.object({
	instanceId: z.string(),
	userToken: Token,
	surveyId: EntityId,
	lastResponded: z.coerce.date(),
	responses: z.array(ResponseDetails),
	tagsAll: z.array(z.union([EntityId, z.null()])).default([]),
});

export const ResponsesDetailsByInstance = z.object({
	instanceId: z.string(),
	userToken: Token,
	surveyId: EntityId,
	lastResponded: z.coerce.date(),
	responses: z.record(ResponseDetails),
	tagsAll: z.array(EntityId),
});

export const ResponsesFilters = z.object({
	receivedFrom: z.coerce.date().optional(),
	receivedTo: z.coerce.date().optional(),
	tags: z.array(EntityId).optional(),
});

// export const SurveyEvent = z.union([ResponseEvent, ActionEvent]);

export type SurveyResponse = z.infer<typeof SurveyResponse>;
export type UserImpression = z.infer<typeof UserImpression>;
export type ResponseDetails = z.infer<typeof ResponseDetails>;
export type ResponsesByInstance = z.infer<typeof ResponsesByInstance>;
export type ResponsesDetailsByInstance = z.infer<typeof ResponsesDetailsByInstance>;
export type Tag = z.infer<typeof Tag>;
export type ResponsesFilters = z.infer<typeof ResponsesFilters>;

export type SurveyEvent = z.infer<typeof SurveyEvent>;
export type SurveyDisplayedEvent = z.infer<typeof SurveyDisplayedEvent>;
export type SurveyRespondedEvent = z.infer<typeof SurveyRespondedEvent>;
export type SurveyCompletedEvent = z.infer<typeof SurveyCompletedEvent>;
