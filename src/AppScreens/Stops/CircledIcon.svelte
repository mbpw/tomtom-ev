<div class="_parent">
    <div class="_circle">
        <slot name="icon">
            <img src="./src/assets/icons/dice.png" alt="Random activity"/>
        </slot>
    </div>
    <div class="_label">
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

</style>