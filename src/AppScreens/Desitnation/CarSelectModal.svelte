<script>
    import {getContext} from "svelte";
    const {close} = getContext('simple-modal');
    import Header from "../../Components/Header.svelte";
    import OptionButton from "../Stops/OptionButton.svelte";
    import {carProfiles} from "./carProfiles";
    import {carProfileStore} from "../../stores/userInput";
</script>

<div>
    <Header backButton={false}>
        Select your car
    </Header>

    {#each carProfiles as carProfile}
        <OptionButton on:click={() => {
            console.log(carProfile)
            $carProfileStore = carProfile;
            close();
        }}>
            {carProfile.name}
        </OptionButton>
    {/each}
</div>

<style lang="scss">
    .target {
        z-index: 1;
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 40px;

        top: 180px;
    }
    .target > img {
        width: 40px;
    }


    ._back {
        //display: inline-block;
        position: absolute;
        z-index: 1;
        bottom: 10px;
        right: 10px;

        height: 30px;
        width: 30px;
        display: inline-block;
        background-color: $primary;

        border-radius: 100px;
        padding: 10px 10px;
        margin-left: 20px;
        transition: all 0.3s ease;

        //transform: rotate(180deg);
    }

    ._back > img {
        height: 29px;
        //margin-left: -4px;
        //margin-bottom: 4px;
    }

    ._back:active {
        background-color: $secondary;
    }
</style>