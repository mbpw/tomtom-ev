<script>
  import logo from './assets/giphy.gif'
  import Counter from './Components/Counter.svelte'
  import Map from './Components/Map.svelte'
  import {globalMap} from "./store";
  import {RouteGenerator} from './computing_engine/route-generator'
  let route_info = 'not computed'
  let result = 'nope';
  let distance = 0;
  let rg = new RouteGenerator();

  async function compute_route() {
    let route = await rg.getNextRoute()
    console.log(route)
    route_info=route.routes[0].summary.travelTimeInSeconds/3600
  }

  async function get_next_poi() {
    let routeOffer = await rg.prepareRouteOffer()
    console.log(routeOffer)
    result = routeOffer.POIs[0].poi.name
    distance = routeOffer.POIs[0].route[0].summary.lengthInMeters

  }

</script>

<main>
  <img src={logo} alt="Svelte Logo" />
  <h1>Hello world!!!</h1>

  <Counter />

  <p>
    Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
    apps.
  </p>

  <p>
    <button on:click={compute_route}>
      Compute next optimal route!, time (h) = {route_info}
    </button>

    <button on:click={get_next_poi}>
      Change POI: {result} + distance = {distance}
    </button>

  </p>
  <Map />
  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for
    the officially supported framework, also powered by Vite!
  </p>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #66ff00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
