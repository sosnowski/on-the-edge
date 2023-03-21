<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    export let show: boolean = false;

    const dispatch = createEventDispatcher<{
        close: {};
    }>();
</script>

<div
    transition:fade
    class="ms-fixed ms-inset-0 ms-bg-gray-500 ms-bg-opacity-75 ms-transition-opacity"
/>

<div transition:fade class="ms-fixed ms-inset-0 ms-z-10 ms-overflow-y-auto">
    <div
        on:click|self={() => dispatch("close")}
        on:keyup|self={() => dispatch("close")}
        class="ms-flex ms-min-h-full ms-items-end ms-justify-center ms-p-4 ms-text-center sm:ms-items-center sm:ms-p-0"
    >
        <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
        <div
            class="ms-relative ms-transform ms-overflow-hidden ms-rounded-lg ms-bg-white ms-px-4 ms-pt-5 ms-pb-4 ms-text-left ms-shadow-xl ms-transition-all sm:ms-my-8 sm:ms-w-full sm:ms-max-w-sm sm:ms-p-6"
        >
            <slot />
        </div>
    </div>
</div>
