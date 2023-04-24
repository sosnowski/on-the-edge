<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher<{
        change: {
            type: "text";
            content: string;
        };
    }>();

    let textValue: string;

    const onInput = (e) => {
        console.log(`Text input ${textValue}`);
        dispatch("change", {
            type: "text",
            content: textValue,
        });
    };
</script>

<div class="mx-auto w-full">
    <textarea
        bind:value={textValue}
        on:input={onInput}
        class="w-full h-28 rounded-md border border-gray-200"
    />
</div>
