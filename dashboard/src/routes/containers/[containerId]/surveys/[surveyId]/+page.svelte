<script lang="ts">
	import { goto } from "$app/navigation";
	import FloatingHeader from "$lib/nav/FloatingHeader.svelte";
	import Dashboard from "$lib/stats/Dashboard.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const onRangeChange = (event: CustomEvent<number>) => {
		const newRange = (event.detail as number) || 15;
		const url = new URL(window.location.href);
		url.searchParams.set("range", newRange.toString());
		goto(url.toString(), { noScroll: true });
	};
</script>

<FloatingHeader
	breadCrumbs={[
		{ name: data.container?.name || "", href: `/containers/${data.container?.id}/surveys` },
		{
			name: data.survey?.name || "",
			href: `/containers/${data.container?.id}/surveys/${data.survey?.id}`,
		},
		{ name: "Dashboard" },
	]}
/>

<Dashboard
	stats={data.stats}
	timeline={data.timeline}
	range={data.range}
	on:range={onRangeChange}
/>
