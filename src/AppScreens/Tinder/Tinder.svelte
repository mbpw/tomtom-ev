<script>
    import Header from "../../Components/Header.svelte";
    import Map from "../../Components/Map.svelte";
    import CardsSwiper from "./CardsSwiper.svelte";
</script>


<div class="_parent">
    <Header>
        Choose your route
    </Header>

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

    .grow {
        flex-grow: 5;
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
        margin-left: 20px;
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