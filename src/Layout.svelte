<script>
    import {fly} from 'svelte/transition';

    import Destination from "./AppScreens/Desitnation/Destination.svelte";
    import Start from "./AppScreens/Start/Start.svelte";
    import {openedScreen} from "./stores/appState";
    import Stops from "./AppScreens/Stops/Stops.svelte";
    import {Modal} from "svelte-simple-modal";
    import Tinder from "./AppScreens/Tinder/Tinder.svelte";
    import Summary from "./AppScreens/Summary/Summary.svelte";
    import RouteDetails from "./AppScreens/Summary/RouteDetails.svelte";

    const flyInOptions = {x: 200, duration: 200};
    const flyOutOptions = {x: -200, duration: 200};
</script>

<Modal>
    {#if $openedScreen === 0}
        <div in:fly={flyInOptions} out:fly={flyOutOptions}>
            <Start />
        </div>
    {/if}
    {#if $openedScreen === 1}
        <div in:fly={flyInOptions} out:fly={flyOutOptions}>
            <Destination/>
        </div>
    {/if}

    {#if $openedScreen === 2}
        <div in:fly={flyInOptions} out:fly={flyOutOptions}>
            <Stops/>
        </div>
    {/if}

    {#if $openedScreen === 3}
        <div in:fly={flyInOptions} out:fly={flyOutOptions}>
            <Tinder />
        </div>
    {/if}

    {#if $openedScreen === 4}
        <div in:fly={flyInOptions} out:fly={flyOutOptions}>
            <Summary />
        </div>
    {/if}

    {#if $openedScreen === 5}
        <div in:fly={flyInOptions} out:fly={flyOutOptions}>
            <RouteDetails />
        </div>
    {/if}

</Modal>

<style>
    div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>