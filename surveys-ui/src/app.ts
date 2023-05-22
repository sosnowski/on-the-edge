import "./app.scss";
import { loadContainerInfo } from "./loader";
import SurveysRoot from "./surveys/Root.svelte";

import App from "./App.svelte";

const CONTAINER_ID = "XkReRD5OEVJlzWuTVpRcZxV11EX3D0";
const userToken = localStorage.getItem("user-token") || "";
const { surveys: surveysMeta, userToken: newUserToken } = await loadContainerInfo(
	userToken,
	CONTAINER_ID,
);

console.log("RECEIVED NEW USER TOKEN " + newUserToken);

if (newUserToken) {
	localStorage.setItem("user-token", newUserToken);
}

const target = document.createElement("div");
target.id = "microsurveys-container-" + CONTAINER_ID;
target.classList.add("micro-survey");
document.body.appendChild(target);

new SurveysRoot({
	target: target,
	props: {
		surveysMeta: surveysMeta,
		containerId: CONTAINER_ID,
		userToken: newUserToken,
	},
});

// ------------------------------

new App({
	target: document.getElementById("app"),
});
