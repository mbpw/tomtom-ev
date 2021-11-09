<script>
    import Header from "../../Components/Header.svelte";
    import Button from "../../Components/Button.svelte";
    import {chargingStops} from "../../stores/routesInfo";
    import DotsSeparator from "../Desitnation/DotsSeparator.svelte";
    import CircledIcon from "./CircledIcon.svelte";
</script>

<div class="_parent">

    <Header>
        Choose your <br> charging stops
    </Header>

    <div>
        <CircledIcon />
    </div>

    <Header>
        ... or get a lucky break
    </Header>

    <Button on:click={() => {
    console.log('Pocisk')
    if($chargingStops)
        $chargingStops = 0;
    else
        $chargingStops = 4;
}}>
        Next
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