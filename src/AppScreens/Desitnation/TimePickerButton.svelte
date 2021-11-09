<script>
    import {startDateStore} from "../../stores/userInput";
    import TimePickerM from "./TimePickerM.svelte";

    let showModal = false;
    let time;

    $: {
        time = $startDateStore.toLocaleString([], { hour12: true}).split(' ')[1].substr(0, 5);
        if(time[time.length - 1] === ':')
            time = time.substr(0, time.length - 1)
    }
    $: ampm = $startDateStore.toLocaleString([], { hour12: true}).split(' ')[2]
</script>

<div class="_background">
    <div class="_label">Start Time</div>
    <div class="_button" on:click={() => {showModal = !showModal}}>
        {time + ' ' + ampm}
    </div>
</div>

{#if showModal}
    <TimePickerM bind:showModal/>
{/if}

<style lang="scss">
    ._background {
        background-color: $darkGray;
        margin: 50px 30px;
        border-radius: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        text-align: center;
        transition: all 0.2s ease;

        color: $secondary;
        font-weight: normal;
    }

    ._label {
        padding: 0 20px;
        display: inline-block;
        font-weight: bold;
    }

    ._button {
        background-color: $gray;
        border-radius: 100px;
        padding: 12px 40px;
        display: inline-block;
        text-align: center;
        transition: all 0.3s ease;

        color: $secondary;
        font-weight: normal;
    }

    ._button:active {
        background-color: #a4a4a4;
    }

    /*:global(._dot) > :global(span) > :global(img) {*/
    /*    width: 18px;*/
    /*}*/
</style>