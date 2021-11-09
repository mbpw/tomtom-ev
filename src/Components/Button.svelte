<script>

</script>

<div class="_button" on:click>
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
        margin: 30px auto;
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

</style>