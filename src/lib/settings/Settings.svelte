<script lang="ts">
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import List, { Item, Graphic, Text, PrimaryText, SecondaryText } from '@smui/list';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Country } from './country';
	import type { Geolocation } from './geolocation';
	import { get } from '$lib/services/api';
	import { country } from '$lib/stores/country';

	const dispatch = createEventDispatcher();
	export let open = false;
	let data: Country[] = [];
	let selectedCountryIndex = 0;

	$: selectedCountry = data[selectedCountryIndex];

	function handleClose(e: CustomEvent<{ action: string }>) {
		if ('save' === e.detail.action) {
			country.set(selectedCountry);
		}
		dispatch('save', {
			selectedCountry: 'AU'
		});
	}

	onMount(async () => {
		data = await get<Country[]>('countries');
		const geolocation: Geolocation = await fetch('https://geolocation-db.com/json/').then((res) =>
			res.json()
		);
		selectedCountryIndex = data.findIndex((c) => c.iso_3166_1 === geolocation.country_code);
	});
</script>

<Dialog
	bind:open
	fullscreen
	aria-labelledby="settings-title"
	aria-describedby="settings-content"
	on:SMUIDialog:closed={handleClose}
	scrimClickAction=""
	escapeKeyAction=""
>
	<Header>
		<Title id="settings-title">Settings</Title>
	</Header>
	<Content id="settings-content">
		<List twoLine avatarList bind:selectedIndex={selectedCountryIndex}>
			{#each data as country}
				<Item
					title={country.name}
					selected={selectedCountry === country}
					autofocus={selectedCountry === country}
				>
					<Graphic
						style="background-image: url(http://purecatamphetamine.github.io/country-flag-icons/3x2/{country.iso_3166_1.toUpperCase()}.svg); background-repeat: no-repeat; background-position: center !important; background-size: contain;"
					/>
					<Text>
						<PrimaryText style="font-weight: bold">{country.name}</PrimaryText>
						<SecondaryText>{country.iso_3166_1}</SecondaryText>
					</Text>
				</Item>
			{/each}
		</List>
	</Content>
	<Actions>
		<Button action="cancel">
			<Label>Cancel</Label>
		</Button>

		<Button action="save" defaultAction variant="raised">
			<Label>Save</Label>
		</Button>
	</Actions>
</Dialog>
