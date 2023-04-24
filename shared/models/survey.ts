import { z } from "zod";
import { EntityId } from "./base";

// export const SurveyType = z.enum(["fixed", "modal"]);
export const SurveyStatus = z.enum(["active", "paused"]);
export const FieldType = z.enum(["text", "rating", "select"]);

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

export const FixedTrigger = z.object({
    type: z.literal("fixed"),
});

export const SurveyTrigger = z.union([
    OnLoadTrigger,
    OnClickTrigger,
    FixedTrigger,
]);

export const Survey = z.object({
    id: EntityId.optional(),
    containerId: EntityId,
    name: z.string(),
    display: z.enum(["always", "user", "session"]),
    status: z.enum(["active", "inactive"]),
    triggerConfig: SurveyTrigger,
});

const BaseField = z.object({
    id: EntityId.optional(),
    label: z.string(),
    type: FieldType,
    autoSubmit: z.boolean().optional(),
});

export const TextField = BaseField.extend({
    type: z.literal("text"),
});

export const RatingField = BaseField.extend({
    type: z.literal("rating"),
});

export const SelectFieldOption = z.object({
    label: z.string(),
    value: z.string(),
});

export const SelectField = BaseField.extend({
    type: z.literal("select"),
    options: z.array(SelectFieldOption),
});

export const SurveyField = z.union([TextField, RatingField, SelectField]);

export const SurveyMetadata = z.object({
    surveyId: EntityId,
    display: Survey.shape.display,
    status: Survey.shape.status,
    triggerConfig: SurveyTrigger,
});

export const SurveyInfo = Survey.extend({
    fields: z.array(SurveyField),
});

// export type SurveyType = z.infer<typeof SurveyType>;
export type SurveyStatus = z.infer<typeof SurveyStatus>;
export type FieldType = z.infer<typeof FieldType>;
export type OnLoadTrigger = z.infer<typeof OnLoadTrigger>;
export type OnClickTrigger = z.infer<typeof OnClickTrigger>;
export type SurveyTrigger = z.infer<typeof SurveyTrigger>;
export type Survey = z.infer<typeof Survey>;
export type TextField = z.infer<typeof TextField>;
export type RatingField = z.infer<typeof RatingField>;
export type SelectFieldOption = z.infer<typeof SelectFieldOption>;
export type SelectField = z.infer<typeof SelectField>;
export type SurveyField = z.infer<typeof SurveyField>;
export type SurveyMetadata = z.infer<typeof SurveyMetadata>;
export type SurveyInfo = z.infer<typeof SurveyInfo>;
