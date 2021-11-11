<script>
import tt from "@tomtom-international/web-sdk-maps";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import {globalMap} from "../store";
import {selectedRouteIndex} from "../stores/routesInfo";
import {MD} from "../map_utils/map-drawer";
import {RG} from "../computing_engine/route-generator";
import { onMount } from "svelte";
let map
let mapElement
export let size2 = false;

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

    map.on('load',function() {
            if($selectedRouteIndex!==null){
                let routeToDraw = RG.offeredRoutes[$selectedRouteIndex]
                MD.drawWholeRouteOnMap((routeToDraw))
            }
    });

    globalMap.set(map)
});


</script>

<div class="map" class:size2 bind:this={mapElement}></div>

<style>
    .map {
        width:100%;
        height:400px
    }
    .size2 {
        height: 600px;
    }
    button {
        margin-top: 2rem;
    }
</style>