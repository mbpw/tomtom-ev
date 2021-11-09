<script>
  import logo from './assets/giphy.gif'
  import Map from './Components/Map.svelte'
  import {globalMap} from "./store";
  import {RouteGenerator} from './computing_engine/route-generator'
  import {MapDrawer} from "./map_utils/map-drawer";
  import Layout from "./Layout.svelte";
  let route_info = 'not computed'
  let result = 'nope';
  let distance = 0;
  let routeLayerId = '0'
  let rg = new RouteGenerator();
  let md = new MapDrawer()

    let kamil = true;

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
