<script>
    import Effect from "./Effect.svelte";
    import Header from "../../Components/Header.svelte";
    import Button from "../../Components/Button.svelte";
    import {openedScreen} from "../../stores/appState";
    import {loadingStatus} from "../../stores/appState";

    loadingStatus.subscribe(value =>{
        console.log('TESTTESTTEST')
        console.log(value)
        if (value[0] === true && value[1]===true){
            console.log('LOADING FINISHED!!!')
            $openedScreen += 1
        }
        }
    )

    let text = "Connecting";
    setTimeout(() => {
        text = 'Downloading'
    }, 800)
    setTimeout(() => {
        text = 'Calculating best routes'
    }, 1400)
    setTimeout(() => {
        text = 'Please wait...'
    }, 5000)
    setTimeout(() => {
        text = 'Something went wrong :( \nRefresh and try again.'
    }, 15000)
    // setTimeout(() => {
    //     text = 'Downloading'
    // }, 1500)
</script>

<div class="_flex">


    <div class="effect">
        <Effect/>
    </div>

    <Header backButton={false}>
        {text}
    </Header>

<!--    <Button on:click={() => {-->
<!--        $openedScreen += 1;-->
<!--    }}>-->
<!--        Debug-->
<!--    </Button>-->
<!--    <Button on:click={() => {-->
<!--        $openedScreen -= 1;-->
<!--    }}>-->
<!--        Debug Back-->
<!--    </Button>-->
</div>

<style>
    ._flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*margin-top: 100px;*/
        text-align: center;
        height: 90vh;
    }

    .effect {
        /*flex-grow: 10;*/
    }
</style>