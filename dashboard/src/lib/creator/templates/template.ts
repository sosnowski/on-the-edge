import type { SurveyQuestion } from "shared/models/survey";

export type Template = {
	name: string;
	icon: string;
	description: string;
	questions: SurveyQuestion[];
};
