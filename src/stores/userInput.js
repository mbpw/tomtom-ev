import { writable } from 'svelte/store';

export const startDateStore = writable(new Date());
export const startPointStore = writable({
    address: 'Choose a start point',
    latlng: null
});
export const endPointStore = writable({
    address: 'Choose an end point',
    latlng: null
});

export const stopsPreferences = writable([]);
