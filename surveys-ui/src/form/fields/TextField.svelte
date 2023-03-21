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

<div class="ms-mx-auto ms-w-full">
    <textarea
        bind:value={textValue}
        on:input={onInput}
        class="ms-w-full ms-h-28 ms-rounded-md ms-border ms-border-gray-200"
    />
</div>
