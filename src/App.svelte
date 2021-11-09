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

  let routeLayerId = '0'
  let rg = new RouteGenerator();
  let md = new MapDrawer()
  let es = new EVSearcher(startPoint, endPoint);
  let ps = new POISearcher('pedestrian', 1800);

    let kamil = true;

  let ev_stations = [];

  function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
  }
  async function compute_route() {
      let route = await rg.getNextRoute()
      console.log(route)
      route_info = route.routes[0].summary.travelTimeInSeconds / 3600
      let pointsList = []
      let stationsList = []
      for (const leg of route.routes[0].legs) {
          for (const point of leg.points) {
              pointsList.push([point.longitude, point.latitude])
          }
          stationsList.push([leg.points.at(-1).longitude, leg.points.at(-1).latitude])
      }
      console.log(stationsList)
      md.drawRouteOnMap(pointsList)
      md.drawEVStationOnMap(stationsList)
  }

    async function get_next_poi() {
        let routeOffer = await rg.prepareRouteOffer()
        console.log(routeOffer)
        result = routeOffer.POIs[0].poi.name
        distance = routeOffer.POIs[0].route[0].summary.lengthInMeters
    }
  async function replace_legs() {
    let pts = await rg.getPointsOfOptimalRoute()
    es.replaceRouteLegs(pts)
  }

  async function searchEVs() {
    ev_stations = await es.computeEVs()
  }

  async function showLegs() {
    console.log(JSON.stringify(es.parsePls()));
  }

  async function showStations() {
    console.log(JSON.stringify(ev_stations));
  }

  async function displayRoute() {
    // map here
    return 0
  }

  async function calculatePolyogns() {
    // ev_stations.results.forEach(async (element) => {
    //     console.log(element.position)
    //     let lat = element.position.lat
    //     let lon = element.position.lon
    //     let poly = await ps.calculatePolygon(lat, lon)
    //     element.rangePolygon = poly
    //     console.log(poly)
    // })

    for (let element of ev_stations.results) {
      console.log(element.position)
      let lat = element.position.lat
      let lon = element.position.lon
      let poly = await ps.calculatePolygon(lat, lon)
      element.rangePolygon = poly
      pause(200)
      console.log(poly)
    }
  }

</script>
{#if kamil}
    <main>
        <button on:click={() => kamil = !kamil}>
            Wyłącz Kamila
        </button>

        <h1>Hello world!!!</h1>

        <p>
            <button on:click={compute_route}>
                Compute next optimal route!, time (h) = {route_info}
            </button>

            <button on:click={get_next_poi}>
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
