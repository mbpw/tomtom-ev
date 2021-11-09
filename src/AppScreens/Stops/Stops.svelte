<script>
    import Header from "../../Components/Header.svelte";
    import Button from "../../Components/Button.svelte";
    import GrayButton from "./GrayButton.svelte";
    import {openedScreen} from "../../stores/appState";

    import { getContext } from 'svelte';
    import CategorySelectorModal from "./CategorySelectorModal.svelte";

    const { open } = getContext('simple-modal');

    const showSurprise = () => {
        open(CategorySelectorModal, { slot: 0 });
    };
</script>


<div class="_parent">

    <Header>
        Choose your <br> charging stops
    </Header>

    <div class="stops_container">
        <GrayButton on:click={() => {
            console.log('yay')
            showSurprise()
        }}/>
        <GrayButton/>
        <GrayButton/>
        <GrayButton/>
        <GrayButton/>
        <GrayButton/>
        <GrayButton/>
    </div>

    <Header>
        ... or get a lucky break
    </Header>

    <div class="buttons">
        <Button on:click={() => {
    $openedScreen = 1;
}}>
            Back
        </Button>

        <Button on:click={() => {
    console.log('Pocisk')
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