import type { SurveyQuestion } from "shared/models/survey";

export type Template = {
	name: string;
	description: string;
	questions: SurveyQuestion[];
};
