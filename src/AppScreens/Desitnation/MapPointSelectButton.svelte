<script>
    export let gps = false;
</script>

<div class="_button" on:click>
    <div class="_text">
        <slot>
            Choose map point
        </slot>
    </div>
    {#if gps}
        <div class="_img">
            <img src="./icons/gps.png" alt="gps"/>
        </div>
    {/if}
</div>


<style lang="scss">


    ._button {
        background-color: #F1F1F1;
        border-radius: 100px;
        margin: 30px 30px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        transition: all 0.3s ease;

        color: $secondary;
        font-weight: normal;
    }

    ._button:active {
        background-color: #a4a4a4;
    }

    ._text {
        padding: 12px 20px;
    }

    ._img {
        //display: inline-block;
        height: 22px;
        width: 22px;
        display: inline-block;

        background-color: $darkGray;
        border-radius: 100px;
        padding: 10px 10px;
    }

    img {
        width: 22px;
        //padding-top: 2px;
    }

</style>