import { writable } from 'svelte/store';

export const startDateStore = writable(new Date());
export const startPointStore = writable({
    address: 'Choose a start point',
    latlng: {
        lat: 52.32563573919947,
        lng: 10.523825676170611
    }
});
export const endPointStore = writable({
    address: 'Choose an end point',
    latlng: {
        lat: 52.509548827862005,
        lng: 13.62762775333342
    }
});

export const carProfileStore = writable({
    name: 'Select car profile',
    chargingParameters: undefined
});

export const stopsPreferences = writable([]);
