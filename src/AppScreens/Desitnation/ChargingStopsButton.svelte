<script>
    import {slide} from 'svelte/transition';

</script>

<div class="_button" on:click in:slide>
    <div class="_text">
        <slot>
            Choose map point
        </slot>
    </div>
        <div class="_img">
            <img src="./icons/arrow_right.png" alt="Choose charging stops"/>
        </div>
</div>


<style lang="scss">
    ._button {
        background-color: #F1F1F1;
        border-radius: 100px;
        margin: 30px 50px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        transition: all 0.3s ease;

        color: $secondary;
        font-weight: normal;
    }

    ._button:active {
        background-color: $darkGray;
    }

    ._text {
        padding: 12px 20px;
    }

    ._img {
        //display: inline-block;
        height: 22px;
        width: 22px;
        display: inline-block;
        background-color: $primary;

        border-radius: 100px;
        padding: 10px 10px;
        transition: all 0.3s ease;
    }
    ._img:active {
        background-color: $secondary;
    }

    img {
        vertical-align: middle;
        width: 22px;
        //padding-top: 2px;
    }

</style>