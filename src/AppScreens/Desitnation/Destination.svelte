<script>
    import Header from "../../Components/Header.svelte";
    import MapPointSelectButton from "./MapPointSelectButton.svelte";
    import TimePickerButton from "./TimePickerButton.svelte";
    import DotsSeparator from "./DotsSeparator.svelte";
    import Button from "../../Components/Button.svelte";
    import {endPointStore, startPointStore} from "../../stores/userInput";
    import {chargingStops} from "../../stores/routesInfo";
    import {openedScreen} from "../../stores/appState";

    import ChargingStopsButton from "./ChargingStopsButton.svelte";
</script>

<Header>
    Ready, steady...
</Header>


<TimePickerButton/>

<MapPointSelectButton gps="true">
    {$startPointStore}
</MapPointSelectButton>

<DotsSeparator/>

{#if $chargingStops}
    <div>
        <ChargingStopsButton on:click={() => {
            console.log('Pocisk');
            $openedScreen = 2;
        }}>
            {$chargingStops} charging stops
        </ChargingStopsButton>
    </div>

    <DotsSeparator/>
{/if}

<MapPointSelectButton>
    {$endPointStore}
</MapPointSelectButton>

<Button on:click={() => {
    console.log('Pocisk')
    if($chargingStops)
        $chargingStops = 0;
    else
        $chargingStops = 4;
}}>
    Go!
</Button>