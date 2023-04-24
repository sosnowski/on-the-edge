import type { SurveyInfo } from "shared/models/survey";

export type SurveyController = {
	survey: SurveyInfo;
	page: unknown;
	onStart: unknown;
	onFinish: unknown;
	onSubmit: unknown;
};
