<script>
    import Text from "../../Components/Text.svelte";
    import Image from "../../Components/Image.svelte";
    import Button from "../../Components/Button.svelte";
    import { openedScreen } from "../../stores/appState";
    import Car from "../../assets/car.svg";
</script>

<div class='' >
    <Text left={true}>Hello!<br><br>I'm glad we're taking a trip together!</Text>

    <Image src={Car}/>

    <Text left={false}>Tell me more about your interests so I can best personalize the route to your needs.</Text>


    <Button on:click={() => {
        $openedScreen = 1;
    }}>
        Let's start!
    </Button>
</div>

<style lang="scss">
    .bg{
        height: 100%;
        background: linear-gradient(180deg, #C6F2E7 0.91%, #10C093 100%);
    }
</style>