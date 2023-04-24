<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";

    const dispatch = createEventDispatcher<{
        close: {};
    }>();
</script>

<div
    transition:fade
    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
/>

<div transition:fade class="fixed inset-0 z-10 overflow-y-auto">
    <div
        on:click|self={() => dispatch("close")}
        on:keyup|self={() => dispatch("close")}
        class="flex min-h-full iteend justify-center p-4 text-center sm:itecenter sm:p-0"
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
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
        >
            <slot />
        </div>
    </div>
</div>
