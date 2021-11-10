<script>
    import logo from './assets/giphy.gif'
    import {EVSearcher} from "./computing_engine/ev-searcher";
    import {POISearcher} from "./computing_engine/poi-searcher";
    import Map from './Components/Map.svelte'
    import {globalMap} from "./store";
    import {RouteGenerator} from './computing_engine/route-generator'
    import {MapDrawer} from "./map_utils/map-drawer";
    import Layout from "./Layout.svelte";

    let route_info = 'not computed'
    let result = 'nope';
    let distance = 0;
    let startPoint = [51.03994, 11.93770]
    let endPoint = [50.10406, 8.62416]
    let routeOffer = undefined
    let routeLayerId = '0'
    let rg = new RouteGenerator();
    let md = new MapDrawer()
    let es = new EVSearcher(startPoint, endPoint);
    let ps = new POISearcher('pedestrian', 1800);

    let kamil = true;

    let ev_stations = {"results": []};
    let ev_coords = [];

    let pointsList = []
    let stationsList = []
    let toggledPois = []

    function pause(milliseconds) {
        var dt = new Date();
        while ((new Date()) - dt <= milliseconds) { /* Do nothing */
        }
    }

    async function zoom_to_popup() {
        let poi = undefined
        for (const leg of routeOffer.routes[0].legs) {
            if (leg.proposedPoi !== undefined && !toggledPois.includes(leg.proposedPoi)) {
                poi = leg.proposedPoi
                toggledPois.push(poi)
                break
            }
        }
        console.log(poi)
        md.zoomAndTogglePoi(poi)

    }

    async function get_next_route() {
        console.log("clearWalkRoutes...")
        md.clearWalkRoutes()

        console.log("Get first (optimal) route...")
        let optimal_route = await rg.computeOptimalRoute()
        let pts = await rg.getPointsOfOptimalRoute()
        rg.po

        console.log("Searching for pois from EV")
        let optimal_pois = await es.batchLatLonSearch(pts)
        for (const poi of optimal_pois.batchItems) {
            ev_stations.results.push(poi.response.results[0])
        }
        let stations = await es.computeEVs()
        // console.log(stations.results)
        for (const station of stations.results) {
            ev_stations.results.push(station)
        }

        console.log("Replacing legs and searching for EV stations again...")
        es.replaceRouteLegs(pts)

        let stations2 = await es.computeEVs()
        // console.log(stations2.results)
        for (const station of stations2.results) {
            ev_stations.results.push(station)
        }

        console.log("Replacing stations in RouteGenerator...")
        console.log(ev_stations)
        await rg.markStationsAsVisited(ev_stations.results)

        console.log("Calculating reachable range...")
        let poly = await ps.calculateBatchPolygons(ev_stations)
        let i = 0
        for (let element of poly.batchItems) {
            ev_stations.results[i].reachableRange = element.response.reachableRange.boundary
            console.log(element.response.reachableRange.boundary)
            i++
        }
        console.log("Batch search POIs...")
        let pois = await ps.searchBatchPois(ev_stations.results)
        let k = 0
        for (let poi of pois.batchItems) {
            ev_stations.results[k].pois = poi.response.results
            k++
        }


        console.log("Prepare route offer...")
        routeOffer = await rg.prepareRouteOffer(ev_stations)
        console.log(routeOffer)


        let pointsList = []
        let stationsList = []
        let poisList = []
        for (const leg of routeOffer.routes[0].legs) {
            for (const point of leg.points) {
                pointsList.push([point.longitude, point.latitude])
            }
            if (leg.summary.chargingInformationAtEndOfLeg !== undefined)
                stationsList.push([leg.points.at(-1).longitude, leg.points.at(-1).latitude])
            if (leg.proposedPoi !== undefined)
                poisList.push(leg.proposedPoi)

        }
        console.log(stationsList)
        md.drawRouteOnMap(pointsList, true, false)
        md.drawEVStationOnMap(stationsList)
        md.drawPoisOnMap(poisList)

        let startCoords = routeOffer.routes[0].legs[0].points.at(0)
        let stopCoords = routeOffer.routes[0].legs.at(-1).points.at(-1)
        md.drawStartandStopOnMap([startCoords.longitude, startCoords.latitude], [stopCoords.longitude, stopCoords.latitude])

        for (const leg of routeOffer.routes[0].legs) {
            console.log(leg)
            if (leg.proposedPoi !== undefined) {
                console.log(leg.proposedPoi)
                result = leg.proposedPoi.poi.name
                let walkPointsList = []
                for (const point of leg.proposedPoi.route[0].legs[0].points) {
                    walkPointsList.push([point.longitude, point.latitude])
                }
                md.drawWalkRouteOnMap(walkPointsList)
                walkPointsList = []
            }
        }
        const optimalTravelTime = rg.optimalRouteTravelTime
        const actualTravelTime = rg.actualRouteTravelTime

        distance = actualTravelTime === optimalTravelTime ? "optimal" : 100 - (actualTravelTime / optimalTravelTime) * 100
        // result = routeOffer.POIs[0].poi.name
        // distance = routeOffer.POIs[0].route[0].summary.lengthInMeters


    }

    async function replace_legs() {
        let pts = await rg.getPointsOfOptimalRoute()
        es.replaceRouteLegs(pts)
    }

    async function searchEVs() {
        let stations = await es.computeEVs()
        console.log(stations.results)
        for (const station of stations.results) {
            ev_stations.results.push(station)
        }
    }

    async function showLegs() {
        console.log(JSON.stringify(es.parsePls()));
    }

    async function showStations() {
        console.log(JSON.stringify(ev_stations.results));
        for (let element of ev_stations.results) {
            ev_coords.push([element.position.lon, element.position.lat])
        }
        md.drawEVStationOnMap(ev_coords, false)
    }

    async function displayRoute() {
        // map here
        return 0
    }

    async function clearMap() {
        md.clearMapDoZera()
    }

    async function calculatePolyogns() {
        let poly = await ps.calculateBatchPolygons(ev_stations)
        let i = 0
        for (let element of poly.batchItems) {
            ev_stations.results[i].reachableRange = element.response.reachableRange.boundary
            console.log(element.response.reachableRange.boundary)
            i++
        }
        let pois = await ps.searchBatchPois(ev_stations.results)
        let k = 0
        for (let poi of pois.batchItems) {
            ev_stations.results[k].pois = poi.response.results
            k++
        }
        return pois
    }


</script>
{#if kamil}
    <main>
        <button on:click={() => kamil = !kamil}>
            Wyłącz Kamila
        </button>

        <h1>Hello world!!!</h1>

        <p>
            <button on:click={zoom_to_popup}>
                Zoom to POI popup
            </button>

            <button on:click={get_next_route}>
                Change POI: {result} + distance = {distance}
            </button>
            <button on:click={replace_legs}>
                Replace legs
            </button>
            <button on:click={searchEVs}>
                Search for EVs along route
            </button>
            <button on:click={showLegs}>
                Show legs :)
            </button>
            <button on:click={showStations}>
                Show stations
            </button>
            <button on:click={displayRoute}>
                Display route on map
            </button>
            <button on:click={clearMap}>
                Clear Map
            </button>
            <button on:click={calculatePolyogns}>
                Calculate polygons
            </button>
        </p>
        <Map/>
    </main>
{:else}
    <Layout/>
{/if}


<style lang="scss">
  :root {
    font-family: $font-family;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: $primary;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }
</style>
