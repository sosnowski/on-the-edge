import type { OnLoadTrigger, OnClickTrigger, SurveyTrigger } from "shared/models/survey";

export type Trigger = (
	config: SurveyTrigger,
	onActiveCallback: () => void,
	onInactiveCallback?: () => void,
) => RemoveTrigger;
export type RemoveTrigger = () => void;

export const setTrigger: Trigger = (config, onActiveCallback, onInactiveCallback) => {
	console.log('Setting trigger for type "' + config.type);
	switch (config.type) {
		case "onload":
			return onLoad(config, onActiveCallback, onInactiveCallback);
		case "onclick":
			return onClick(config, onActiveCallback);
		case "always":
			return always(config, onActiveCallback);
	}
};

const globPatternToRegex = (glob: string): RegExp => {
	return new RegExp(`^${glob.replace(/\./g, "\\.").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
};

export const onLoad: Trigger = (config: OnLoadTrigger, onActiveCallback, onInactiveCallback) => {
	let interval;
	let timer;
	let href;
	const regex = config.pageGlob ? globPatternToRegex(config.pageGlob) : new RegExp(".*");

	interval = setInterval(() => {
		if (href !== window.location.href) {
			console.log("LOCATION CHANGE TO " + window.location.href);
			href = window.location.href;
			if (regex.test(window.location.pathname)) {
				timer = setTimeout(() => {
					onActiveCallback();
				}, config.delay || 0);
			} else if (onInactiveCallback) {
				onInactiveCallback();
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

export const onClick: Trigger = (config: OnClickTrigger, onActiveCallback) => {
	let timer;
	console.log("Setting up click trigger for selector " + config.selector);
	const listener = (event) => {
		console.log("Trigger on click " + event.target);
		const target = event.target as HTMLElement;
		if (target.matches(config.selector)) {
			console.log("Matching selector!");
			timer = setTimeout(() => {
				onActiveCallback();
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

export const always: Trigger = (config, onActiveCallback) => {
	onActiveCallback();
	return () => {};
};
