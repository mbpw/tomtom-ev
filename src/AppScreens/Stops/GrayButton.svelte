<script>
    import CircledIcon from "./CircledIcon.svelte";
</script>

<div on:click>
    <slot>
        <CircledIcon />
    </slot>
</div>

<style lang="scss">
    div {
        background: $gray;
        border-radius: 20px;
        width: 150px;
        height: 150px;
        text-align: center;
        margin: 10px;
        transition: all 0.3s ease;
    }
    div:active {
        background: $darkGray;
    }

</style>
