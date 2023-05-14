import "./app.scss";
import { loadSurveys, loadContainerInfo } from "./loader";
import SurveysRoot from "./surveys/Root.svelte";

import App from "./App.svelte";

const CONTAINER_ID = "XkReRD5OEVJlzWuTVpRcZxV11EX3D0";

const userToken = localStorage.getItem("microsurvey-user-token");
const sessionToken = sessionStorage.getItem("microsurvey-session-token");

const {
	userToken: newUserToken,
	sessionToken: newSessionToken,
	surveys: surveysMeta,
} = await loadContainerInfo(CONTAINER_ID, userToken, sessionToken);

if (newUserToken) {
	localStorage.setItem("microsurvey-user-token", newUserToken);
}
if (newSessionToken) {
	sessionStorage.setItem("microsurvey-session-token", newSessionToken);
}

const surveys = await loadSurveys(CONTAINER_ID, surveysMeta);

const target = document.createElement("div");
target.id = "microsurveys-container-" + CONTAINER_ID;
target.classList.add("micro-survey");
document.body.appendChild(target);

new SurveysRoot({
	target: target,
	props: {
		surveys: surveys,
		userToken: newUserToken,
		sessionToken: newSessionToken,
	},
});

// ------------------------------

new App({
	target: document.getElementById("app"),
});
// logika odpowiedzialna za określenie jaki to user i workspace / container
// pobranie aktywnych ankiet z API
// wyrenderowanie ankiet + lub podpięcie odpowiednich triggerów w zaleności od typu ankiety
