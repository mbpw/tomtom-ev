import { writable } from 'svelte/store';
import {routesDemoData} from "./routesDemoData";

export const chargingStops = writable(null);

export const routesStore = writable(routesDemoData);

export const selectedRouteIndex = writable(null);