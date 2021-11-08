<script>
    import logo from './assets/giphy.gif'
    import Counter from './lib/Counter.svelte'

    import ky from 'ky';
    let result = 'nope';
    async function test_api_ask() {
        console.log('test4')
        result = await ky.post('https://api.tomtom.com/routing/1/calculateRoute/52.507,13.492:50.104,8.624/json?key=KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P',
            {json: {allowVignette: ['AUS']
                }}).json();
        // result = await ky.post('https://api.tomtom.com/routing/1/calculateRoute/50.95421%2C6.90852%3A52.50825%2C13.45686/json?avoid=unpavedRoads&vehicleEngineType=electric&constantSpeedConsumptionInkWhPerHundredkm=50.0%2C6.5%3A100.0%2C8.5&currentChargeInkWh=10&maxChargeInkWh=40&minChargeAtDestinationInkWh=5.2&minChargeAtChargingStopsInkWh=1.5&key=KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P',['Content-Type: application/json','Accept: application/json']).json()

        console.log(result);
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
        <button on:click={test_api_ask}>
            response: {result}
        </button>

    </p>
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
