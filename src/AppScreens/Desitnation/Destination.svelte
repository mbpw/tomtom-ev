<script>
    import Header from "../../Components/Header.svelte";
    import MapPointSelectButton from "./MapPointSelectButton.svelte";
    import TimePickerButton from "./TimePickerButton.svelte";
    import DotsSeparator from "./DotsSeparator.svelte";
    import Button from "../../Components/Button.svelte";
    import {endPointStore, startPointStore} from "../../stores/userInput";
    import {chargingStops} from "../../stores/routesInfo";
    import {openedScreen} from "../../stores/appState";
    import {RG} from "../../computing_engine/route-generator";

    import ChargingStopsButton from "./ChargingStopsButton.svelte";
    import {getContext} from "svelte";
    import MapPickerModal from "./MapPickerModal.svelte";

    const {open} = getContext('simple-modal');

    async function computeChargingStopsNumber(){
        $chargingStops = await RG.computeOptimalRouteSize($startPointStore.latlng,$endPointStore.latlng)
    }

</script>

<Header>
    Ready, steady...
</Header>


<TimePickerButton/>

<MapPointSelectButton gps="true" on:click={() => {
   open(MapPickerModal, {store: startPointStore}, {closeButton: false, styleContent: {padding: 0, borderRadius: '10px'}});
}}>
    {$startPointStore.address}
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

<MapPointSelectButton on:click={() => {
       open(MapPickerModal, {store: endPointStore}, {closeButton: false, styleContent: {padding: 0, borderRadius: '10px'}});
}}>
    {$endPointStore.address}
</MapPointSelectButton>

<MapPointSelectButton>
    Select car profile
</MapPointSelectButton>

{#if !$chargingStops}
    <Button on:click={() => {
    console.log('Pocisk')
    if($chargingStops)
        $chargingStops = 0;
    else
        $chargingStops = 4;
    computeChargingStopsNumber()

}}>
        Go!
    </Button>
{/if}