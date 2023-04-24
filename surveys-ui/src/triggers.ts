import type {
    OnLoadTrigger,
    OnClickTrigger,
    SurveyTrigger,
} from "shared/models/survey";

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
    let interval;
    let timer;
    let href;
    const regex = config.pageRegex
        ? new RegExp(config.pageRegex)
        : new RegExp(".*");

    interval = setInterval(() => {
        if (href !== window.location.href) {
            console.log("LOCATION CHANGE TO " + window.location.href);
            href = window.location.href;
            if (regex.test(window.location.pathname)) {
                timer = setTimeout(() => {
                    callback();
                }, config.delay || 0);
            }
        }
    }, 200);

    return () => {
        if (interval) {
            clearInterval(interval);
        }
        if (timer) {
            clearTimeout(timer);
        }
    };
};

export const onClick: Trigger = (config: OnClickTrigger, callback) => {
    let timer;

    const listener = (event) => {
        console.log("Trigger on click " + event.target);
        const target = event.target as HTMLElement;
        if (target.matches(config.selector)) {
            console.log("Matching selector!");
            timer = setTimeout(() => {
                callback();
            }, config.delay || 0);
        }
    };

    document.addEventListener("click", listener);

    return () => {
        if (listener) {
            document.removeEventListener("click", listener);
        }
        if (timer) {
            clearTimeout(timer);
        }
    };
};
