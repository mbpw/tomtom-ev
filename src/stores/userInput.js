import { writable } from 'svelte/store';

export const startDateStore = writable(new Date());
export const startPointStore = writable({
    address: 'Choose a start point',
    latlng: {
        lat: 52,
        lng: 21
    }
});
export const endPointStore = writable({
    address: 'Choose an end point',
    latlng: {
        lat: 53,
        lng: 22
    }
});

export const carProfileStore = writable({
    name: 'Select car profile',
    chargingParameters: undefined
});

export const stopsPreferences = writable([]);
