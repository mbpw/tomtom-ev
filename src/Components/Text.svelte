<script>
	export let left;
</script>

{#if left}

<div class="left">
    <h3>
        <slot>
            Let's go!
        </slot>
    </h3>
</div>

{:else}

<div class="right">
    <h3>
        <slot>
            Let's go!
        </slot>
    </h3>
</div>

{/if}

<style lang="scss">
    .left {
        padding-top: 10px;
        margin-left: 30px;
    }

    .left h3{
        color: $primary;
        text-align: left;
    }

    .right {
        margin-left: calc(30% - 30px);
        margin-right: 30px;
    }

    .right h3{
        color: $secondary;
        text-align: right;
    }

    div {
        width: 70%;
    }
    
    h3 {
        font-style: normal;
        font-weight: 600;
    }
</style>