import { z } from "zod";
import { EntityId } from "./base";

export * from "./base";

export const SurveyDisplayType = z.enum(["fab", "modal", "toast"]); //FAB: Floating Action Button
export const SurveyStatus = z.enum(["active", "paused"]);
export const QuestionType = z.enum(["text", "rating", "select"]);

export const OnLoadTrigger = z.object({
	type: z.literal("onload"),
	delay: z.number().min(0).optional(),
	pageGlob: z.string().optional(),
});

export const OnClickTrigger = z.object({
	type: z.literal("onclick"),
	selector: z.string(),
	delay: z.number().min(0).optional(),
});

export const AlwaysTrigger = z.object({
	type: z.literal("always"),
});

export const SurveyTrigger = z.union([OnLoadTrigger, OnClickTrigger, AlwaysTrigger]);

export const PublishConfig = z.object({
	start: z.coerce.date(),
});

export const Survey = z.object({
	id: EntityId.optional(),
	containerId: EntityId,
	name: z.string(),
	status: z.enum(["active", "inactive"]),
	displayType: SurveyDisplayType,
	triggerConfig: SurveyTrigger,

	published: PublishConfig.nullable().optional(),

	updated: z.coerce.date().optional(),
	created: z.coerce.date().optional(),
});

const BaseQuestion = z.object({
	id: EntityId.optional(),
	label: z.string(),
	type: QuestionType,
	order: z.number().optional(),
});

export const TextQuestion = BaseQuestion.extend({
	type: z.literal("text"),
});

export const RatingQuestion = BaseQuestion.extend({
	type: z.literal("rating"),
});

export const SelectQuestionOption = z.object({
	label: z.string(),
	value: z.string(),
});

export const SelectQuestion = BaseQuestion.extend({
	type: z.literal("select"),
	options: z.array(SelectQuestionOption),
});

export const SurveyQuestion = z.union([TextQuestion, RatingQuestion, SelectQuestion]);

export const SurveyMetadata = z.object({
	surveyId: EntityId,
	displayType: Survey.shape.displayType,
	status: Survey.shape.status,
	triggerConfig: SurveyTrigger,
});

export const SurveyInfo = Survey.extend({
	containerName: z.string().optional(),
	questions: z.array(SurveyQuestion),
});

export type SurveyStatus = z.infer<typeof SurveyStatus>;
export type QuestionType = z.infer<typeof QuestionType>;
export type OnLoadTrigger = z.infer<typeof OnLoadTrigger>;
export type OnClickTrigger = z.infer<typeof OnClickTrigger>;
export type SurveyTrigger = z.infer<typeof SurveyTrigger>;
export type Survey = z.infer<typeof Survey>;
export type TextQuestion = z.infer<typeof TextQuestion>;
export type RatingQuestion = z.infer<typeof RatingQuestion>;
export type SelectQuestionOption = z.infer<typeof SelectQuestionOption>;
export type SelectQuestion = z.infer<typeof SelectQuestion>;
export type SurveyQuestion = z.infer<typeof SurveyQuestion>;
export type SurveyMetadata = z.infer<typeof SurveyMetadata>;
export type SurveyInfo = z.infer<typeof SurveyInfo>;
export type SurveyDisplayType = z.infer<typeof SurveyDisplayType>;
export type PublishConfig = z.infer<typeof PublishConfig>;
