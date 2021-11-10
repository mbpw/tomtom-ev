import { writable } from 'svelte/store';

export const startDateStore = writable(new Date());
export const startPointStore = writable('Choose a start point');
export const endPointStore = writable('Choose an end point');

export const stopsPreferences = writable([]);
