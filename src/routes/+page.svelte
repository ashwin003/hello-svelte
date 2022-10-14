<script lang="ts">
	import { get } from '$lib/services/api';
	import { country } from '$lib/stores/country';
	import { onMount } from 'svelte';
	import type { Station } from './station';
	import List, { Item, Graphic, Text, PrimaryText, SecondaryText, Meta } from '@smui/list';
	import Player from '$lib/player/Player.svelte';
	import InfiniteLoading from 'svelte-infinite-loading';
	import type { StateChanger } from 'svelte-infinite-loading';
	import type { Country } from '$lib/settings/country';
	import { station } from '$lib/stores/station';

	const pageSize = 25;
	let page = 1;
	let data: Station[] = [];
	let hasMore = true;
	let selectedCountry: Country | undefined = undefined;
	let selectedStationIndex = -1;
	let infiniteId = Symbol();

	$: selectedStation = data[selectedStationIndex];

	function infiniteHandler(e: CustomEvent<StateChanger>) {
		if (undefined === selectedCountry) {
			e.detail.complete();
		} else {
			fetchData(selectedCountry.iso_3166_1, false)
				.then(() => {
					if (hasMore) {
						e.detail.loaded();
					} else {
						e.detail.complete();
					}
				})
				.catch(() => {
					e.detail.error();
				});
		}
	}

	const allowedCodecs = ['MP3', 'AAC', 'OGG'];

	const fetchData = async (countryCode: string, replaceData: boolean) => {
		const offset = (page - 1) * pageSize;
		let newData = await get<Station[]>(
			'stations/search' +
				'?countrycode=' +
				countryCode +
				'&offset=' +
				offset +
				'&limit=' +
				pageSize +
				'&hidebroken=true' +
				'&order=clickcount'
		);
		newData = newData.filter(s => allowedCodecs.includes(s.codec));
		hasMore = newData.length > 0;
		if (hasMore) {
			page = page + 1;
			data = replaceData ? newData : [...data, ...newData];
		}
	};

	onMount(() => {
		country.subscribe((c) => {
			selectedCountry = c;
			if (undefined !== c) {
				document.title = c.name + ' | Radio Browser';
				selectedStationIndex = -1;
				page = 1;
				infiniteId = Symbol();
				fetchData(c.iso_3166_1, true);
			}
		});
	});
</script>

<svelte:head>
	<title>Stations | Radio Browser</title>
	<meta name="description" content="List all radio stations from the selected country" />
</svelte:head>

<List twoLine avatarList bind:selectedIndex={selectedStationIndex}>
	{#each data as radioStation}
		<Item
			title={radioStation.name}
			on:SMUI:action={() => station.set(radioStation)}
			selected={selectedStation === radioStation}
			autofocus={selectedStation === radioStation}
		>
			<Graphic
				style="background-image: url({radioStation.favicon}); background-repeat: no-repeat; background-position: center !important; background-size: contain;"
			/>
			<Text>
				<PrimaryText>
					{radioStation.name}
				</PrimaryText>
				<SecondaryText>
					{radioStation.country}
				</SecondaryText>
			</Text>
			<Meta>{radioStation.codec}</Meta>
		</Item>
	{/each}
</List>
<InfiniteLoading on:infinite={infiniteHandler} forceUseInfiniteWrapper identifier={infiniteId}>
	<slot name="noResults" />
</InfiniteLoading>

<Player />
