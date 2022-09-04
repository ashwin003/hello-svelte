<script lang="ts">
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Settings from '$lib/settings/Settings.svelte';
	import { onMount } from 'svelte';
	import { country } from '$lib/stores/country';
	let open = false;
	let title = 'Radio Browser';

	onMount(() => {
		country.subscribe((c) => {
			title = undefined === c ? 'Radio Browser' : c.name;
		});
	});
</script>

<TopAppBar variant="static" color="primary">
	<Row>
		<Section>
			<Title>{title}</Title>
		</Section>
		<Section align="end" toolbar>
			<IconButton class="material-icons" aria-label="Settings" on:click={() => (open = true)}
				>settings</IconButton
			>
		</Section>
	</Row>
</TopAppBar>
<Settings {open} on:save={() => (open = false)} />
