<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<style>
	main {
		width: 100vw;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
		height: calc(100vh - 3.5em);
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>
