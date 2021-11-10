<script>
    import Header from "../../Components/Header.svelte";
    import Map from "../../Components/Map.svelte";
    import Button from "../../Components/Button.svelte";

    import {openedScreen} from "../../stores/appState";

</script>


<div class="_parent">

    <Header>
        Choose your route
    </Header>

    <Map />
    <Button on:click={() => {
            $openedScreen = 2;
        }}>
        Back
    </Button>
</div>

<style>
    ._parent {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

</style>