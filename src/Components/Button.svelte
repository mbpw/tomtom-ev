<script>
    export let blue = false;
</script>

<div class="_button" class:blue on:click>
    <div class="_text">
        <slot>
            Button
        </slot>
    </div>
</div>

<style lang="scss">
    ._button {
        background-color: $primary;
        border-radius: 100px;
        margin: 10px auto;
        padding: 12px 40px;

        transition: all 0.3s ease;

        color: #ffffff;
        font-weight: bold;

        text-align: center;
        width: fit-content;
    }

    ._button:active {
        background-color: $secondary;
    }

    .blue {
        background-color: $secondary;
    }

</style>