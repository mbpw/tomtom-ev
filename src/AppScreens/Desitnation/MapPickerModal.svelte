<script>
    import Map from "../../Components/Map.svelte";
    import {globalMap} from "../../store";
    import {getContext} from "svelte";
    import ky from "ky";

    const {close} = getContext('simple-modal');

    export let store;
</script>

<div>
    <div class="_back" on:click={() => {
            $store.latlng = $globalMap.getCenter();
            $store.address = '...';
            ky.get(`https://api.tomtom.com/search/2/reverseGeocode/${$store.latlng.lat}%2C${$store.latlng.lng}.json?key=KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P`)
                .json().then((result) => {
                    if(result.addresses[0].address.freeformAddress)
                        $store.address = result.addresses[0].address.freeformAddress;
                    else
                        $store.address = $store.latlng;
                });
            close()
        }}>
        <img src="./icons/apply.svg" alt="Choose charging stops"/>
    </div>
    <div class="target">
        <img src="./icons/pin.svg" alt="Pin" />
    </div>
    <Map/>
</div>

<style lang="scss">
    .target {
        z-index: 1;
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 40px;

        top: 180px;
    }
    .target > img {
        width: 40px;
    }


    ._back {
        //display: inline-block;
        position: absolute;
        z-index: 1;
        bottom: 10px;
        right: 10px;

        height: 30px;
        width: 30px;
        display: inline-block;
        background-color: $primary;

        border-radius: 100px;
        padding: 10px 10px;
        margin-left: 20px;
        transition: all 0.3s ease;

        //transform: rotate(180deg);
    }

    ._back > img {
        height: 29px;
        //margin-left: -4px;
        //margin-bottom: 4px;
    }

    ._back:active {
        background-color: $secondary;
    }
</style>