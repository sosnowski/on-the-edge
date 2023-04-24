import type { SurveyField } from "shared/models/survey";

export type Template = {
	name: string;
	description: string;
	fields: SurveyField[];
};
