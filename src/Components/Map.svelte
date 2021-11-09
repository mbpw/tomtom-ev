<script>
import tt from "@tomtom-international/web-sdk-maps";
import {globalMap} from "../store";
import { onMount } from "svelte";
let map
let mapElement
onMount(() => {
    map = tt.map({
        key: "KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P",
        container: mapElement,
        stylesVisibility: {
            trafficIncidents: true,
            trafficFlow: true
        },
        center: [21, 52],
        zoom: 5
    });
});
globalMap.subscribe(value => {
    map = value;
});
</script>

<div class="map" bind:this={mapElement}></div>

<style>
    .map {
        height: 60%;
    }
    button {
        margin-top: 2rem;
    }
</style>