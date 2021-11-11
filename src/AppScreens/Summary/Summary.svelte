<script>
    import Header from "../../Components/Header.svelte";
    import Map from "../../Components/Map.svelte";
    import {routesStore, selectedRouteIndex} from "../../stores/routesInfo";
    import {openedScreen} from "../../stores/appState";
    import {globalMap} from "../../store";
    import { onMount } from "svelte";
    import {RG} from "../../computing_engine/route-generator";
    import {MD} from "../../map_utils/map-drawer";
    import tt from "@tomtom-international/web-sdk-maps";
    import Button from "../../Components/Button.svelte";

    $: route = $routesStore[$selectedRouteIndex];

    // $globalMap.on('load',function() {
    //     console.log(route)
    //     let routeToDraw = RG.offeredRoutes[$selectedRouteIndex]
    //     MD.drawWholeRouteOnMap((routeToDraw))
    // })



</script>
<div class="parent">
    <Header>
        Your route
    </Header>

    <div class="infos">
        <div class="info">
            <img src="./icons/clock.svg" alt="Travel time"/>
            <p>{Math.floor(route.duration / 60 / 60)}h {Math.floor(route.duration % 3600 / 60)}m</p>
        </div>
        <div class="info">
            <img src="./icons/distance.svg" alt="Travel time"/>
            <p>{Math.floor(route.distance / 1000)} km</p>
        </div>
    </div>

    <div class="map">
        <Map size2={true}/>
    </div>

    <div>
        <Button blue on:click={() => {
        $openedScreen += 1;
    }}>
            Route details
        </Button>
    </div>
</div>

<style lang="scss">
    .parent {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .infos {
        display: flex;
        justify-content: space-evenly;
        margin: 10px 50px;
    }

    .info {
        display: flex;
    }

    .info > p {
        margin: 5px 10px;
        color: $primary;
        font-weight: bold;
    }

    .map {
        flex-grow: 5;
    }
</style>