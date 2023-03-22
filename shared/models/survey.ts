import { z } from "zod";

export const SurveyType = z.enum(["fixed", "modal"]);
export const SurveyStatus = z.enum(["active", "paused"]);
export const FieldType = z.enum(["text", "score"]);
export const EntityId = z.number().min(0);

export const SurveyField = z.object({
    fieldId: EntityId,
    label: z.string(),
    type: FieldType,
    autoSubmit: z.boolean().optional(),
});

export const SurveyPage = z.object({
    description: z.string(),
    fields: z.array(SurveyField),
});

export const OnLoadTrigger = z.object({
    type: z.literal("onload"),
    delay: z.number().min(0).optional(),
});

export const SurveyTrigger = OnLoadTrigger;

export const SurveyConfig = z.object({
    type: SurveyType,
    display: z.enum(["always", "user", "session"]),
    status: z.enum(["active", "paused"]),
    trigger: SurveyTrigger,
});

export const Survey = z.object({
    surveyId: EntityId,
    name: z.string(),
    config: SurveyConfig,
    pages: z.array(SurveyPage),
});

export type SurveyField = z.infer<typeof SurveyField>;
export type SurveyPage = z.infer<typeof SurveyPage>;
export type Survey = z.infer<typeof Survey>;
export type OnLoadTrigger = z.infer<typeof OnLoadTrigger>;
export type SurveyTrigger = z.infer<typeof SurveyTrigger>;
export type SurveyConfig = z.infer<typeof SurveyConfig>;
export type SurveyType = z.infer<typeof SurveyType>;
export type SurveyStatus = z.infer<typeof SurveyStatus>;
export type FieldType = z.infer<typeof FieldType>;
export type EntityId = z.infer<typeof EntityId>;

export const TextResponse = z.object({
    type: z.literal("text"),
    fieldId: EntityId,
    content: z.string().optional(),
});

export const NumericResponse = z.object({
    type: z.literal("number"),
    fieldId: EntityId,
    content: z.number().optional(),
});

export const ResponseSchema = z.union([TextResponse, NumericResponse]);

const Event = z.object({
    surveyId: EntityId,
    userId: EntityId,
    sessionToken: z.string().length(30),
});

export const ResponseEvent = Event.extend({
    type: z.literal("response"),
    responses: z.array(z.union([TextResponse, NumericResponse])),
});

export const ActionType = z.enum(["open", "finish"]);

export const ActionEvent = Event.extend({
    type: z.literal("action"),
    action: ActionType,
});

export const SurveyEvent = z.union([ResponseEvent, ActionEvent]);

export type TextResponse = z.infer<typeof TextResponse>;
export type NumericResponse = z.infer<typeof NumericResponse>;
export type Response = TextResponse | NumericResponse;
export type ResponseEvent = z.infer<typeof ResponseEvent>;
export type ActionType = z.infer<typeof ActionType>;
export type ActionEvent = z.infer<typeof ActionEvent>;
export type SurveyEvent = z.infer<typeof SurveyEvent>;
