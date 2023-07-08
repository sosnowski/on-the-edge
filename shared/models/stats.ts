import { z } from "zod";

export const SurveyStats = z.object({
	numberOfResponses: z.number(),
	surveysDisplayed: z.number(),
	surveysResponded: z.number(),
	surveysCompleted: z.number(),
});

export const SurveyTimelineEntry = z.object({
	day: z.coerce.date(),
	surveysDisplayed: z.number(),
	surveysResponded: z.number(),
	surveysCompleted: z.number(),
});

export type SurveyStats = z.infer<typeof SurveyStats>;
export type SurveyTimelineEntry = z.infer<typeof SurveyTimelineEntry>;
