<script>
import tt from "@tomtom-international/web-sdk-maps";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
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
        zoom: 5,
        attributionControlPosition: 'top-right'
    });

    globalMap.set(map)
});


</script>

<div class="map" bind:this={mapElement}></div>

<style>
    .map {
        width:100%;
        height:400px
    }
    button {
        margin-top: 2rem;
    }
</style>