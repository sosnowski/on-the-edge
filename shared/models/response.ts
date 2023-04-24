//import zod
import { z } from "zod";
import { EntityId, Token } from "./base";
export * from "./base";

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

export const SurveyResponse = z.union([TextResponse, NumericResponse]);

const Event = z.object({
    surveyId: EntityId,
    userToken: Token,
    sessionToken: Token,
});

export const ResponseEvent = Event.extend({
    type: z.literal("response"),
    responses: z.array(SurveyResponse),
});

export const ActionType = z.enum(["open", "finish"]);

export const ActionEvent = Event.extend({
    type: z.literal("action"),
    action: ActionType,
});

export const SurveyEvent = z.union([ResponseEvent, ActionEvent]);

export type TextResponse = z.infer<typeof TextResponse>;
export type NumericResponse = z.infer<typeof NumericResponse>;
export type SurveyResponse = z.infer<typeof SurveyResponse>;
export type ResponseEvent = z.infer<typeof ResponseEvent>;
export type ActionType = z.infer<typeof ActionType>;
export type ActionEvent = z.infer<typeof ActionEvent>;
export type SurveyEvent = z.infer<typeof SurveyEvent>;
