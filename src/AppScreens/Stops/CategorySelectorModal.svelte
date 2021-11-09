<script>
    import Header from "../../Components/Header.svelte";
    import CircledIcon from "./CircledIcon.svelte";

    export let message;
</script>

<Header>
    Category
</Header>

<div class="categories_container">
    <CircledIcon on:click={() => {
            console.log('yay')

        }}/>

    <CircledIcon />
    <CircledIcon />
    <CircledIcon />
    <CircledIcon />
    <CircledIcon />
</div>

<style>
    .categories_container {
        width: 100%;
        /*height: 300px;*/
        overflow: scroll;
        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        align-self: stretch;
        align-content: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>