import { writable } from 'svelte/store';
import {carProfiles} from "../AppScreens/Desitnation/carProfiles";

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
    // body: undefined,
    // params: undefined
    body: carProfiles[1].body,
    params: carProfiles[1].params
});

export const stopsPreferences = writable([]);
