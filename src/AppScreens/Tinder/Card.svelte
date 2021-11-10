<script>
    import Button from "../../Components/Button.svelte";
    import {startDateStore} from "../../stores/userInput";

    export let route;
</script>

<div class="card">
    <div class="header">
        <div class="infos">
            <div class="info">
                <img src="./icons/clock.svg" alt="Travel time"/>
                <p>{route.duration}</p>
            </div>
            <div class="info">
                <img src="./icons/distance.svg" alt="Travel time"/>
                <p>{route.distance}</p>
            </div>
        </div>
        <div>
            <Button>
                Select
            </Button>
        </div>
    </div>

    <div class="details">
        Route details
    </div>

    <div>
        <div class="stop">
            <p class="timestamp">{$startDateStore.toLocaleString([]).split(' ')[1].substr(0, 5)}</p>
            <div>
                <img src="./icons/stop_dot.svg" alt="Travel time"/>
            </div>
            <p>Start</p>
        </div>
        {#each route.stops as stop, i}
            <div class="stop">
                <p class="timestamp">{stop.arrivalTime}</p>
                <div>
                    <div class="vl"></div>
                    <img src="./icons/stop_dot.svg" alt="Travel time"/>
                </div>
                <p>{stop.name}</p>
            </div>
        {/each}
        <div class="stop">
            <p class="timestamp">{($startDateStore).toLocaleString([]).split(' ')[1].substr(0, 5)}</p>
            <div>
                <img src="./icons/stop_dot.svg" alt="Travel time"/>
            </div>
            <p>End</p>
        </div>
    </div>
</div>

<style lang="scss">
    .card {
        width: 90vw;
        height: 300px;
        padding: 10px;
        margin: 10px 10px;
        z-index: 1000000000;
        background: #FFFFFF;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .infos {
        //text-align: left;
        //line-height: 50px;
    }

    .info {
        display: flex;
        justify-content: flex-start;
    }

    .info > p {
        margin: 5px 10px;
        color: $primary;
        font-weight: bold;
    }

    .stop {
        display: flex;
        justify-content: flex-start;
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

    .details {
        color: $secondary;
        font-weight: bold;
        text-align: left;
        margin: 10px 20px;
    }
</style>