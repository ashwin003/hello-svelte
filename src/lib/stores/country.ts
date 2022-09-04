import type { Country } from '$lib/settings/country';
import { writable } from 'svelte/store';

export const country = writable<Country | undefined>(undefined);
