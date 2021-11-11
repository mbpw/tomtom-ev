<script>
    import Header from "../../Components/Header.svelte";
    import CircledIcon from "./CircledIcon.svelte";
    import {all_categories_ids, categories} from "./categories";
    import OptionButton from "./OptionButton.svelte";
    import {getContext} from "svelte";
    import {stopsPreferences} from "../../stores/userInput";

    const {close} = getContext('simple-modal');

    export let slot;
    let selectedCategory = null;
</script>

{#if !selectedCategory}

    <Header backButton={false}>
        Category
    </Header>

    <div class="categories_container">
        {#each categories as category}
            <CircledIcon on:click={() => {
                selectedCategory = category;
            }}>
            <span slot="icon">
                <img src="{category.icon}" alt="{category.name}"/>
            </span>
                <span slot="label">
                {category.name}
            </span>
            </CircledIcon>
        {/each}

        <CircledIcon on:click={() => {
            $stopsPreferences[slot].name = 'Randomize';
            $stopsPreferences[slot].option = 'Randomize';
            $stopsPreferences[slot].category_id = all_categories_ids;
            $stopsPreferences[slot].icon = './icons/dice.svg';
            close();
        }}>
            <span slot="label">
                Randomize
            </span>
        </CircledIcon>

    </div>
{:else}
    <div class="_img" on:click={() => {
        selectedCategory = null;
    }}>
        <img src="./icons/arrow_right.svg" alt="Back"/>
    </div>

    <Header backButton={false}>
        {selectedCategory.name}
    </Header>

    <div class="category-icon">
        <CircledIcon green>
            <span slot="icon">
                <img src="{selectedCategory.icon}" alt="{selectedCategory.name}"/>
            </span>
            <span slot="label">

            </span>
        </CircledIcon>
    </div>

    {#each selectedCategory.options as option}
        <OptionButton on:click={() => {
            console.log(selectedCategory.name + ' ' + option.name)
            $stopsPreferences[slot].name = selectedCategory.name;
            $stopsPreferences[slot].option = option.name;
            $stopsPreferences[slot].category_id = option.category_id;
            $stopsPreferences[slot].icon = selectedCategory.icon;
            close();
        }}>
            {option.name}
        </OptionButton>
    {/each}

{/if}

<style lang="scss">
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

    .category-icon {
        text-align: center;
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

        transform: rotate(180deg);
    }

    ._img > img {
        margin-left: -4px;
    }

    ._img:active {
        background-color: $secondary;
    }
</style>