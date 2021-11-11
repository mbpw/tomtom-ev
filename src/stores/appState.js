import { writable } from 'svelte/store';

export const openedScreen = writable(0);

export const loadingStatus = writable([false,false])