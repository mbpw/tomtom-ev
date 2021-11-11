<script>
    import {openedScreen} from "../stores/appState";

    export let backButton = true;
</script>


<div class="_header">
    {#if backButton}
        <div class="_back" on:click={() => {
            $openedScreen -= 1;
        }}>
            <img src="./icons/arrow_right.svg" alt="Choose charging stops"/>
        </div>
    {/if}
    <div class="grow">
        <h1 class:centering-margin={backButton}>
            <slot>
                Let's go!
            </slot>
        </h1>
    </div>
</div>


<style lang="scss">
    h1 {
        color: $primary;
        text-align: center;
        font-style: normal;
        font-weight: bold;
        font-size: 28px;
    }

    .centering-margin {
        margin-left: -50px;
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