import { writable } from 'svelte/store';

export const latestCertificateCID = writable<string | null>(null);
