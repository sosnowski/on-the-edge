import "./app.scss";
import { loadSurveys } from "./loader";
import FixedSurvey from "./surveys/FixedSurvey.svelte";
import ModalSurvey from "./surveys/ModalSurvey.svelte";

const surveys = await loadSurveys("1234567890");

surveys.forEach((survey) => {
    let SurveyCmp;

    switch (survey.config.type) {
        case "fixed":
            SurveyCmp = FixedSurvey;
            break;
        case "modal":
            SurveyCmp = ModalSurvey;
            break;
    }

    console.log("Rendering " + survey.config.type + " survey");

    const target = document.createElement("div");
    target.id = "microsurvey-" + survey.surveyId;
    target.classList.add("micro-survey");
    document.body.appendChild(target);

    new SurveyCmp({
        target: target,
        props: {
            survey: survey,
        },
    });
});

// logika odpowiedzialna za określenie jaki to user i workspace / container
// pobranie aktywnych ankiet z API
// wyrenderowanie ankiet + lub podpięcie odpowiednich triggerów w zaleności od typu ankiety
