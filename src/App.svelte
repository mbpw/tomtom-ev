<script>
    import {RouteGenerator} from './computing_engine/route-generator'
    import Layout from "./Layout.svelte";

    let route_info = 'not computed'
    let result = 'nope';
    let distance = 0;
    let rg = new RouteGenerator();

    let kamil = true;

    async function compute_route() {
        let route = await rg.getNextRoute()
        console.log(route)
        route_info = route.routes[0].summary.travelTimeInSeconds / 3600
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
