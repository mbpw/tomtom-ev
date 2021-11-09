<script>
    import Header from "../../Components/Header.svelte";
    import GradientBorder from "../../Components/GradientBorder.svelte";

    import MapPointSelectButton from "./MapPointSelectButton.svelte";
    import TimePickerButton from "./TimePickerButton.svelte";
    import DotsSeparator from "./DotsSeparator.svelte";
    import Button from "../../Components/Button.svelte";

</script>

<Header>
    Ready, steady...
</Header>


<TimePickerButton />

<MapPointSelectButton gps="true">
    Choose a start point
</MapPointSelectButton>

<DotsSeparator />

<MapPointSelectButton>
    Choose an end point
</MapPointSelectButton>

<Button on:click={() => {console.log('Pocisk')}}>
    Go!
</Button>