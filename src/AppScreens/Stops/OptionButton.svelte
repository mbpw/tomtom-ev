<script>
    import CircledIcon from "./CircledIcon.svelte";
</script>

<div on:click>
    <slot>
        Option
    </slot>
</div>

<style lang="scss">
    div {
        background: $gray;
        border-radius: 100px;
        margin: 10px;
        padding: 15px 30px;
        color: $secondary;
        transition: all 0.3s ease;
    }
    div:active {
        background: $darkGray;
    }

</style>
