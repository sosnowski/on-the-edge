<script lang="ts">
	const onRouteClick = (path: string) => {
		console.log("Push state " + path);
		window.history.pushState({}, "", path);
	};
</script>

<div>
	<button on:click={() => onRouteClick("/some-page")}>/some-page</button>
	<button on:click={() => onRouteClick("/sprzedam/mieszkanie")}>/sprzedam/mieszkanie</button>
	<button on:click={() => onRouteClick("/sprzedam/mieszkanie/ad-123456")}
		>/sprzedam/mieszkanie/ad-123456</button
	>

	<button id="trigger-survey" on:click={() => console.log("TRIGGER CLICKED")}>Trigger survey</button
	>
</div>
