<script>
    import Header from "../../Components/Header.svelte";
    import Button from "../../Components/Button.svelte";
    import GrayButton from "./GrayButton.svelte";
    import {loadingStatus, openedScreen} from "../../stores/appState";
    import {routesStore} from "../../stores/routesInfo";
    import {startPointStore} from "../../stores/userInput";
    import {endPointStore} from "../../stores/userInput";


    import {getContext} from 'svelte';
    import CategorySelectorModal from "./CategorySelectorModal.svelte";
    import {chargingStops} from "../../stores/routesInfo";
    import CircledIcon from "./CircledIcon.svelte";
    import {stopsPreferences} from "../../stores/userInput";

    import {RG} from "../../computing_engine/route-generator";
    import {MD} from "../../map_utils/map-drawer";
    import {randomize_ids} from "./categories";

    const {open} = getContext('simple-modal');
    let isRoutesClicked = false
    let routesCanBeComputed = false
    $stopsPreferences = [];
    for (let i = 0; i < $chargingStops; i++) {
        $stopsPreferences.push({
            name: 'Randomize',
            option: 'Randomize',
            icon: '',
            category_id: randomize_ids
        })
    }

    const showSurprise = (slot) => {
        open(CategorySelectorModal, {slot: slot});
    };
    loadingStatus.subscribe(value => {
        if(value[0]===true && isRoutesClicked && !routesCanBeComputed){
            prepareRoutes()
        }
        else if(value[0]===true &&!isRoutesClicked){
            routesCanBeComputed=true
        }
    })

    function prepareRoutesClicked(){
        if (routesCanBeComputed)
            prepareRoutes()
        else
            isRoutesClicked = true
    }

    async function prepareRoutes(){
        console.log($stopsPreferences)
        console.log($startPointStore)
        console.log($endPointStore)

        // await RG.generateStationsObject($startPointStore.latlng,$endPointStore.latlng)
        let routes = await RG.computeAllRouteOffers(3,$stopsPreferences)
        console.log(routes)
        routesStore.set(routes)
        console.log(RG.offeredRoutes)
        loadingStatus.update(value=> {
            value[1]=true
            return value
        })

        // MD.drawWholeRouteOnMap(RG.offeredRoutes[0])
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
            $openedScreen += 1;
            prepareRoutesClicked()

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