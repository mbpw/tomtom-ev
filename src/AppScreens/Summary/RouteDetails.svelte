<script>
    import Header from "../../Components/Header.svelte";
    import {routesStore, selectedRouteIndex} from "../../stores/routesInfo";
    import {startDateStore} from "../../stores/userInput";

    $: route = $routesStore[$selectedRouteIndex];
</script>

<Header blue>
    Your route details
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

<div>
    <div class="stop"
         on:click={() => {
                    console.log('Pociśnięto START w routcie ' + $selectedRouteIndex);
                }}
    >
        <p class="timestamp">{$startDateStore.toLocaleString([]).split(' ')[1].substr(0, 5)}</p>
        <div>
            <img src="./icons/stop_dot.svg" alt="Travel time"/>
        </div>
        <p>Start</p>
    </div>
    <div class="separator"></div>

    {#each route.stops as stop, i}
        <div class="stop"
             on:click={() => {
                    console.log($routesStore)
                    console.log('Pociśnięto element ' + i + ' w routcie ' + $selectedRouteIndex);
                }}
        >
            <p class="timestamp">{stop.arrivalTime.substr(11, 5)}</p>
            <div>
                <div class="vl"></div>
                <img src="./icons/stop_dot.svg" alt="Travel time"/>
            </div>
            <p>{stop.name}</p>
        </div>
        <div class="separator"></div>
    {/each}
    <div class="stop"
         on:click={() => {
                }}
    >
        <p class="timestamp">{new Date($startDateStore.getTime() + (route.duration * 1000)).toLocaleString([]).split(' ')[1].substr(0, 5)}</p>
        <div>
            <img src="./icons/stop_dot.svg" alt="Travel time"/>
        </div>
        <p>End</p>
    </div>
</div>


<style lang="scss">
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

    .stop {
        display: flex;
        justify-content: flex-start;
        //border-bottom: #000000 solid 1px;
        transition: all 0.3s ease;
    }
    .stop:active {
        background-color: $darkGray;
    }

    .separator {
        background: linear-gradient(90deg, #FFFFFF 10%, #D5D5D5 30%, #FFFFFF 100%);
        height: 2px;
        z-index: -10;
        width: 200px;
        margin: auto;
    }

    .stop > p {
        margin: 5px 5px;
        //color: $primary;
        //font-weight: bold;
    }

    //noinspection CssInvalidPropertyValue
    .stop > div > img {
        vertical-align: bottom;
        vertical-align: -webkit-baseline-middle;
    }

    .timestamp {
        margin: 5px 5px 5px 0 !important;
        font-weight: 300;
        width: 45px;
    }

    .vl {
        border-left: 1px solid #000000;
        height: 50px;
        position: absolute;
        margin-top: -10px;
        margin-left: 7px;
        z-index: -1;
    }
</style>