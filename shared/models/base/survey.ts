import { z } from "zod";
import { EntityId } from "./base";

export const SurveyType = z.enum(["fixed", "modal"]);
export const SurveyStatus = z.enum(["active", "paused"]);
export const FieldType = z.enum(["text", "score"]);

export const OnLoadTrigger = z.object({
    type: z.literal("onload"),
    delay: z.number().min(0).optional(),
    pageRegex: z.string().optional(),
});

export const OnClickTrigger = z.object({
    type: z.literal("onclick"),
    selector: z.string(),
    delay: z.number().min(0).optional(),
});

export const SurveyTrigger = z.union([OnLoadTrigger, OnClickTrigger]);

export const Survey = z.object({
    id: EntityId,
    name: z.string(),
    type: SurveyType,
    display: z.enum(["always", "user", "session"]),
    status: z.enum(["active", "inactive"]),
    triggerConfig: SurveyTrigger,
});

export const SurveyField = z.object({
    fieldId: EntityId,
    label: z.string(),
    type: FieldType,
    autoSubmit: z.boolean().optional(),
});

export const SurveyPage = z.object({
    pageId: EntityId,
    description: z.string(),
});

export type SurveyType = z.infer<typeof SurveyType>;
export type SurveyStatus = z.infer<typeof SurveyStatus>;
export type FieldType = z.infer<typeof FieldType>;
export type OnLoadTrigger = z.infer<typeof OnLoadTrigger>;
export type OnClickTrigger = z.infer<typeof OnClickTrigger>;
export type SurveyTrigger = z.infer<typeof SurveyTrigger>;
export type Survey = z.infer<typeof Survey>;
export type SurveyField = z.infer<typeof SurveyField>;
export type SurveyPage = z.infer<typeof SurveyPage>;
