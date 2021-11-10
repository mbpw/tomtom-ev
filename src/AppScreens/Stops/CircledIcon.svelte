<script>
    export let green = false;

    console.log(green)
</script>


<div class="_parent" on:click>
    <div class="_circle" class:green>
        <slot name="icon">
            <img src="./icons/dice.svg" alt="Random activity"/>
        </slot>
    </div>
    <div class="_label" class:green-font={green}>
        <slot name="label">
            Pick a stop
        </slot>
    </div>
</div>


<style lang="scss">
    ._parent {
        display: inline-block;
        margin: 10px;
    }

    ._circle {
        height: 54px;
        width: 54px;
        padding: 23px;
        display: inline-block;
        border: 2px solid $secondary;
        text-align: center;
        border-radius: 100px;
    }

    ._label {
        margin-top: 5px;
        text-align: center;
        color: $secondary;
    }

    .green {
        filter: invert(0) sepia(1) saturate(5) hue-rotate(120deg);
    }
    .green-font {
        color: $primary;
    }

</style>