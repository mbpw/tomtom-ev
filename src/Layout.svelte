<script>
    import {fly} from 'svelte/transition';

    import Destination from "./AppScreens/Desitnation/Destination.svelte";
    import {openedScreen} from "./stores/appState";
    import Stops from "./AppScreens/Stops/Stops.svelte";

    const flyInOptions = { x: 200, duration: 200 };
    const flyOutOptions = { x: -200, duration: 200 };
</script>

{#if $openedScreen === 1}
    <div in:fly={flyInOptions} out:fly={flyOutOptions}>
        <Destination/>
    </div>
{/if}

{#if $openedScreen === 2}
    <div in:fly={flyInOptions} out:fly={flyOutOptions}
         on:click={() => {
        $openedScreen = 1;
    }}>
        <Stops />
    </div>
{/if}

<style>
    div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>