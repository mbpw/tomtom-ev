<script>
    import Header from "../../Components/Header.svelte";
    import Button from "../../Components/Button.svelte";
    import GrayButton from "./GrayButton.svelte";
    import {openedScreen} from "../../stores/appState";
    import {routesStore} from "../../stores/routesInfo";

    import {getContext} from 'svelte';
    import CategorySelectorModal from "./CategorySelectorModal.svelte";
    import {chargingStops} from "../../stores/routesInfo";
    import CircledIcon from "./CircledIcon.svelte";
    import {stopsPreferences} from "../../stores/userInput";

    import {RG} from "../../computing_engine/route-generator";
    import {MD} from "../../map_utils/map-drawer";

    const {open} = getContext('simple-modal');

    $stopsPreferences = [];
    for (let i = 0; i < $chargingStops; i++) {
        $stopsPreferences.push({
            name: '',
            option: '',
            icon: ''
        })
    }

    const showSurprise = (slot) => {
        open(CategorySelectorModal, {slot: slot});
    };

    async function prepareRoutes(){
        await RG.generateStationsObject()
        let routes = await RG.computeAllRouteOffers(3)
        console.log(routes)
        routesStore.set(routes)
        console.log(RG.offeredRoutes)
        MD.drawWholeRouteOnMap(RG.offeredRoutes[0])
    }
</script>


<div class="_parent">

    <Header>
        Choose your <br> charging stops
    </Header>

    <div class="stops_container">
        {#each $stopsPreferences as slot, i}
            <GrayButton on:click={() => {
                console.log('yay')
                showSurprise(i)
            }}>
                {#if slot.icon}
                    <CircledIcon green>
                        <span slot="icon">
                            <img src="{slot.icon}" alt="{slot.name}"/>
                        </span>
                        <span slot="label">
                            {slot.option}
                        </span>
                    </CircledIcon>
                {:else}
                    <CircledIcon/>
                {/if}
            </GrayButton>
        {/each}
    </div>

    <Header backButton={false}>
        ... or get a lucky break
    </Header>

    <div class="buttons">
        <Button on:click={() => {
            $openedScreen = 1;
        }}>
            Back
        </Button>

        <Button on:click={() => {
            $openedScreen = 3;
            prepareRoutes()
        }}>
            Next
        </Button>
    </div>
</div>

<style>
    ._parent {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .stops_container {
        width: 100vw;
        /*height: 300px;*/
        overflow: scroll;
        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        align-self: stretch;
        align-content: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .buttons {
        display: flex;
    }
</style>