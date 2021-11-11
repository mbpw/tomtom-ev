<script>
    import Card from "./Card.svelte";
    import {Swiper, SwiperSlide} from 'swiper/svelte';
    import {MD} from "../../map_utils/map-drawer";
    import {RG} from "../../computing_engine/route-generator";

    import 'swiper/css';
    import 'swiper/css/pagination';
    import {routesStore} from "../../stores/routesInfo";
    import {Pagination} from "swiper";
</script>

<Swiper class="mySwiper"
        modules={[Pagination]}
        pagination={{ clickable: true, el: '.swiper-pagination', }}
        on:activeIndexChange={(e) => {
        const activeRouteIndex = e.detail[0][0].activeIndex;
        console.log(activeRouteIndex);
        let routeToDraw = RG.offeredRoutes[activeRouteIndex]
        MD.drawWholeRouteOnMap((routeToDraw))
        // TODO: Tutaj rób coś na mapce przy przewijaniu kart
    }}
>
    {#each $routesStore as route, i}
        <SwiperSlide>
            <Card route={route} routeIndex={i}/>
        </SwiperSlide>
    {/each}
</Swiper>
<div class="swiper-pagination"></div>

<style>
    :global(.swiper) {
        transform: translateY(-40px);
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