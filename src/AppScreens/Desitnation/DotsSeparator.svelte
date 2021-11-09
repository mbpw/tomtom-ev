<script>
    export let quantity = 3;
</script>

{#each Array(quantity) as _, i}
    <div>

    </div>
{/each}

<style lang="scss">
    div {
        height: 15px;
        width: 15px;
        margin: 15px auto;
        border-radius: 100px;
        background: $secondary;
    }
</style>