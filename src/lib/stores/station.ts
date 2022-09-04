import type { Station } from 'src/routes/station';
import { writable } from 'svelte/store';

export const station = writable<Station | undefined>(undefined);
