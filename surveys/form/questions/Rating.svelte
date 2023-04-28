<script lang="ts">
    import { SurveyQuestion } from "shared/models/survey";
    import { createEventDispatcher } from "svelte";

    export let question: SurveyQuestion;

    const dispatch = createEventDispatcher<{
        submit: number;
    }>();

    const options = [
        { value: 1, icon: "fa-regular fa-face-sad-tear" },
        { value: 2, icon: "fa-regular fa-face-frown" },
        { value: 3, icon: "fa-regular fa-face-meh" },
        { value: 4, icon: "fa-regular fa-face-grin-wide" },
        { value: 5, icon: "fa-regular fa-face-grin-stars" },
    ];

    const onSelect = (value: number) => {
        dispatch("submit", value);
    };
</script>

<div class="flex flex-col gap-4 w-full h-full">
    <p class="text-center text-slate-800 text-lg">{question.label}</p>
    <div class="flex flex-row gap-5 justify-center items-center text-3xl">
        {#each options as option}
            <button
                on:click={() => onSelect(option.value)}
                class="text-slate-600 hover:text-fuchsia-500"
            >
                <i class={option.icon} />
            </button>
        {/each}
    </div>
</div>
