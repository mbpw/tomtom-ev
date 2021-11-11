<script>
    import Header from "../../Components/Header.svelte";
    import MapPointSelectButton from "./MapPointSelectButton.svelte";
    import TimePickerButton from "./TimePickerButton.svelte";
    import DotsSeparator from "./DotsSeparator.svelte";
    import Button from "../../Components/Button.svelte";
    import {carProfileStore, endPointStore, startDateStore, startPointStore} from "../../stores/userInput";
    import {loadingStatus} from "../../stores/appState";

    import {chargingStops} from "../../stores/routesInfo";
    import {openedScreen} from "../../stores/appState";
    import {RG} from "../../computing_engine/route-generator";

    import ChargingStopsButton from "./ChargingStopsButton.svelte";
    import {getContext} from "svelte";
    import MapPickerModal from "./MapPickerModal.svelte";
    import CarSelectModal from "./CarSelectModal.svelte";
    import {carProfiles} from "./carProfiles";

    const {open} = getContext('simple-modal');

    function initCarParams() {
        console.log($carProfileStore)
        RG.initCarParams($carProfileStore.params, $carProfileStore.body)
    }

    async function computeChargingStopsNumber() {
        $chargingStops = await RG.computeOptimalRouteSize($startPointStore.latlng, $endPointStore.latlng)
    }
    async function computeStationsObject() {
        await RG.generateStationsObject($startPointStore.latlng,$endPointStore.latlng)
        loadingStatus.update(value=> {
            value[0]=true
            return value
        })
    }

    let waiting = false;
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
            $openedScreen += 1;
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

<MapPointSelectButton on:click={() => {
       open(CarSelectModal, {}, {closeButton: true});
}}>
    {$carProfileStore.name}
</MapPointSelectButton>

{#if !$chargingStops}
    <Button on:click={() => {
        waiting = true;
        initCarParams();
        computeChargingStopsNumber();
        computeStationsObject();
    }}>
        {#if waiting}
            Waiting...
        {:else}
            Go!
        {/if}
    </Button>
{:else}
    <Button on:click={() => {
        $chargingStops = 0;
        waiting = false;

        $startDateStore = new Date();
        $startPointStore = {
            address: 'Choose a start point',
            latlng: {
                lat: 52.32563573919947,
                lng: 10.523825676170611
            }
        };
        $endPointStore = {
            address: 'Choose an end point',
            latlng: {
                lat: 52.509548827862005,
                lng: 13.62762775333342
            }
        };
        $carProfileStore = ({
            name: 'Select car profile',
            // body: undefined,
            // params: undefined
            body: carProfiles[1].body,
            params: carProfiles[1].params
        });
}}>
        Reset
    </Button>
{/if}