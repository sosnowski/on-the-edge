<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div
    class="pointer-events-none fixed inset-x-0 bottom-8 px-6 pb-6 bg-red"
>
    <div
        class="pointer-events-auto ml-auto max-w-lg rounded-md bg-white p-4 shadow-lg border border-red-200"
    >
        <slot />
    </div>
</div>
