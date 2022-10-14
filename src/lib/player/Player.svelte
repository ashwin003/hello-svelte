<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	import { onMount } from 'svelte';
	import { station } from '$lib/stores/station';
	import type { Station } from 'src/routes/station';
	import LayoutGrid, { Cell } from '@smui/layout-grid';

	let currentlyPlaying: Station | undefined = undefined;

	let audio;

	let icon = 'play_circle_outline';

	onMount(() => {
		audio = document.getElementsByTagName('audio')[0];
		if (undefined !== audio) {
			audio.onerror = () => {
				icon = 'error_outline';
			};
			audio.onloadstart = () => {
				icon = 'sync';
			};
			audio.onplaying = () => {
				icon = 'stop_circle';
			};
			audio.onpause = () => {
				icon = 'play_circle_outline';
			};
		}

		station.subscribe((s) => {
			currentlyPlaying = s;
		});
	});
</script>

{#if currentlyPlaying !== undefined}
	<Paper
		elevation={15}
		style="position: absolute;bottom: 0;left:0.5em;right:0.5em;background-image: url({currentlyPlaying.favicon});background-size: cover; background-position-y:50%;padding: 0;"
	>
		<Content class="player-content">
			<LayoutGrid>
				<Cell span={7} style="grid-column-end: span 12;">
					<div class="mdc-typography--headline2">{currentlyPlaying.name}</div>
				</Cell>
				<Cell span={3} style="grid-column-start: 13;">
					<div class="mdc-typography--headline2">{currentlyPlaying.country}</div>
				</Cell>
			</LayoutGrid>
			<audio src={currentlyPlaying.url_resolved} autoplay />
		</Content>
	</Paper>
{/if}
