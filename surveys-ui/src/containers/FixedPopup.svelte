<script lang="ts">
    import { fade } from "svelte/transition";

    export let show: boolean = false;
</script>

<div
    transition:fade
    class="ms-pointer-events-none ms-fixed ms-inset-x-0 ms-bottom-8 ms-px-6 ms-pb-6"
>
    <div
        class="ms-pointer-events-auto ms-ml-auto ms-max-w-lg ms-rounded-md ms-bg-white ms-p-4 ms-shadow-lg ms-border ms-border-red-200"
    >
        <slot />
    </div>
</div>
