import "./app.scss";
import FixedSurvey from "./surveys/FixedSurvey.svelte";

const fixedDiv = document.createElement("div");

document.body.appendChild(fixedDiv);

const fixSurvey = new FixedSurvey({
    target: fixedDiv,
});

// logika odpowiedzialna za określenie jaki to user i workspace / container
// pobranie aktywnych ankiet z API
// wyrenderowanie ankiet + lub podpięcie odpowiednich triggerów w zaleności od typu ankiety
