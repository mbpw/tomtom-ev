<script>
    import Card from "./Card.svelte";
    import {Swiper, SwiperSlide} from 'swiper/svelte';

    import 'swiper/css';
    import {routesStore} from "../../stores/routesInfo";
</script>

<Swiper class="mySwiper"
    on:activeIndexChange={(e) => {
        const activeRouteIndex = e.detail[0][0].activeIndex;
        console.log(activeRouteIndex);
        // TODO: Tutaj rób coś na mapce przy przewijaniu kart
    }}
>
    {#each $routesStore as route, i}
        <SwiperSlide>
            <Card route={route} routeIndex={i}/>
        </SwiperSlide>
    {/each}
</Swiper>

<style>
    :global(.swiper) {
        /*transform: translateY(-15px);*/
    }

    :global(.swiper-slide) {
        text-align: center;
        font-size: 18px;
        /*background: #fff;*/

        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
    }
</style>