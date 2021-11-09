<script>
    import {fly} from 'svelte/transition';

    import Destination from "./AppScreens/Desitnation/Destination.svelte";
    import {openedScreen} from "./stores/appState";
    import Stops from "./AppScreens/Stops/Stops.svelte";
    import {Modal} from "svelte-simple-modal";

    const flyInOptions = {x: 200, duration: 200};
    const flyOutOptions = {x: -200, duration: 200};
</script>

<Modal>
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