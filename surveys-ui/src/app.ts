import "./app.scss";
import { loadSurveys, loadContainerInfo } from "./loader";
import FixedSurvey from "./surveys/FixedSurvey.svelte";
import ModalSurvey from "./surveys/ModalSurvey.svelte";

import App from "./App.svelte";

const CONTAINER_ID = "1234567890";

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

surveys.forEach((survey) => {
    let SurveyCmp;

    switch (survey.type) {
        case "fixed":
            SurveyCmp = FixedSurvey;
            break;
        case "modal":
            SurveyCmp = ModalSurvey;
            break;
    }

    console.log("Rendering " + survey.type + " survey");

    const target = document.createElement("div");
    target.id = "microsurvey-" + survey.surveyId;
    target.classList.add("micro-survey");
    document.body.appendChild(target);

    new SurveyCmp({
        target: target,
        props: {
            survey: survey,
            userToken: newUserToken,
            sessionToken: newSessionToken,
        },
    });
});

new App({
    target: document.getElementById("app"),
});
// logika odpowiedzialna za określenie jaki to user i workspace / container
// pobranie aktywnych ankiet z API
// wyrenderowanie ankiet + lub podpięcie odpowiednich triggerów w zaleności od typu ankiety
