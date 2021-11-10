<script>
    import Header from "../../Components/Header.svelte";
    import Map from "../../Components/Map.svelte";
    import Button from "../../Components/Button.svelte";

    import {openedScreen} from "../../stores/appState";
    import CardsSwiper from "./CardsSwiper.svelte";
</script>


<div class="_parent">
    <div class="_header">
        <div class="_back" on:click={() => {
            $openedScreen = 2
        }}>
            <img src="./icons/arrow_right.svg" alt="Choose charging stops"/>
        </div>
        <Header>
            Choose your route
        </Header>
    </div>

    <Map/>

    <div class="cards">
        <CardsSwiper/>
    </div>

<!--    <Button on:click={() => {-->
<!--            $openedScreen = 2;-->
<!--        }}>-->
<!--        Back-->
<!--    </Button>-->
</div>

<style lang="scss">
    ._parent {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    ._header {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .cards {
        flex-grow: 4;
    }



    ._back {
        //display: inline-block;
        height: 22px;
        width: 22px;
        display: inline-block;
        background-color: $primary;

        border-radius: 100px;
        padding: 10px 10px;
        transition: all 0.3s ease;

        transform: rotate(180deg);
    }

    ._back > img {
        margin-left: -4px;
    }

    ._back:active {
        background-color: $secondary;
    }

</style>