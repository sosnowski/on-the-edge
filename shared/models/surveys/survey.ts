import { z } from "zod";
import {
    SurveyTrigger,
    SurveyType,
    SurveyField,
    SurveyPage,
    Survey,
} from "../base/survey";
import { EntityId } from "../base/base";

export * from "../base/survey";
export * from "../base/base";

export const SurveyPageInfo = SurveyPage.extend({
    fields: z.array(SurveyField),
});

export const SurveyMetadata = z.object({
    surveyId: EntityId,
    type: SurveyType,
    display: Survey.shape.display,
    status: Survey.shape.status,
    triggerConfig: SurveyTrigger,
});

export const SurveyInfo = Survey.extend({
    pages: z.array(SurveyPageInfo),
});

export type SurveyPageInfo = z.infer<typeof SurveyPageInfo>;
export type SurveyMetadata = z.infer<typeof SurveyMetadata>;
export type SurveyInfo = z.infer<typeof SurveyInfo>;
