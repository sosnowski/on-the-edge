import type { OnLoadTrigger, SurveyTrigger } from "shared/models/survey";

export type Trigger = (
    config: SurveyTrigger,
    callback: () => void
) => RemoveTrigger;
export type RemoveTrigger = () => void;

export const setTrigger: Trigger = (config, callback) => {
    switch (config.type) {
        case "onload":
            return onLoad(config, callback);
        default:
            throw new Error("Unsupported trigger type " + config.type);
    }
};

export const onLoad: Trigger = (config: OnLoadTrigger, callback) => {
    const time = setTimeout(callback, config.delay || 100);
    return () => {
        clearTimeout(time);
    };
};
