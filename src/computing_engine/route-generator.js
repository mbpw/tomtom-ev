import ky from 'ky';
import {ev_stations} from './temp_data';
import {WalkSimulator} from "./walk-simulator";
import {EVSearcher} from "./ev-searcher";
import {POISearcher} from "./poi-searcher";

const endpoint = 'https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/';
const vehicleEngineType = 'electric'
const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';




export class RouteGenerator {
    constructor(startPoint = [52.32563573919947, 10.523825676170611], endPoint = [52.509548827862005, 13.62762775333342], constantSpeedConsumptionInkWhPerHundredkm = "32,10.87:77,18.01", currentChargeInkWh = 20, maxChargeInkWh = 40, minChargeAtDestinationInkWh = 4, minChargeAtChargingStopsInkWh = 4, POIs = null, evStations = null) {
        this.startPoint = startPoint
        this.endPoint = endPoint
        this.constantSpeedConsumptionInkWhPerHundredkm = constantSpeedConsumptionInkWhPerHundredkm
        this.currentChargeInkWh = currentChargeInkWh
        this.maxChargeInkWh = maxChargeInkWh
        this.minChargeAtDestinationInkWh = minChargeAtDestinationInkWh
        this.minChargeAtChargingStopsInkWh = minChargeAtChargingStopsInkWh
        this.optimalRouteGoodEnough = true
        this.POIs = []//pois_in_city.results
        for (const POI of this.POIs) {
            POI.visited = false
        }
        this.evStations = []//ev_stations.results

        this.optimalRoute = null
        this.optimalRouteTravelTime = 0
        this.actualRouteTravelTime = 0
        this.offeredRoutes = []
        this.carParams = {}
    }

    initCarParams(params,body){
        this.carParams = body
        this.constantSpeedConsumptionInkWhPerHundredkm = params.constantSpeedConsumptionInkWhPerHundredkm
        this.currentChargeInkWh = params.currentChargeInkWh
        this.maxChargeInkWh = params.maxChargeInkWh
        this.minChargeAtDestinationInkWh = params.minChargeAtDestinationInkWh
        this.minChargeAtChargingStopsInkWh = params.minChargeAtChargingStopsInkWh
    }

    getEndpointURL(start_x, start_y, stop_x, stop_y, currentCharge) {
        return endpoint + start_x + ',' + start_y + ':' + stop_x + ',' + stop_y + '/json?key=' + key + '&vehicleEngineType=' + vehicleEngineType + '&constantSpeedConsumptionInkWhPerHundredkm=' + this.constantSpeedConsumptionInkWhPerHundredkm + '&currentChargeInkWh=' + currentCharge + '&maxChargeInkWh=' + this.maxChargeInkWh + '&minChargeAtDestinationInkWh=' + this.minChargeAtDestinationInkWh + '&minChargeAtChargingStopsInkWh=' + this.minChargeAtChargingStopsInkWh
    }

    async makeOptimalRouteApiCall(endpoint, body) {
        console.log(endpoint)
        return await Promise.resolve(ky.post(endpoint, body).json())
    }

    async computeOptimalRoute() {
        let endpointURL = this.getEndpointURL(this.startPoint[0], this.startPoint[1], this.endPoint[0], this.endPoint[1], this.currentChargeInkWh)
        let body = {json: this.carParams}
        let optimalRoute = await this.makeOptimalRouteApiCall(endpointURL, body)
        return this.optimalRoute = optimalRoute
    }

    async computeOptimalRouteSize(start_point, end_point) {
        let startPoint = [start_point.lat,start_point.lng]
        let endPoint = [end_point.lat,end_point.lng]
        let endpointURL = this.getEndpointURL(startPoint[0], startPoint[1], endPoint[0], endPoint[1], this.currentChargeInkWh)
        let body = {json: this.carParams}
        let optimalRoute = await this.makeOptimalRouteApiCall(endpointURL, body)
        return optimalRoute.routes[0].legs.length-1
    }

    async getPointsOfOptimalRoute() {
        if (this.optimalRoute == null) {
            this.computeOptimalRoute()
        }
        const points = []
        for (const leg of this.optimalRoute.routes[0].legs) {
            points.push(...leg.points)
        }
        return points
    }

    async getNextRoute() {
        console.log(this.evStations)
        // for (const station of this.evStations){
        //     station.visited = false
        //     for (const poi of station.pois){
        //         poi.visited = false
        //     }
        // }
        if (this.optimalRouteGoodEnough) {
            this.optimalRouteGoodEnough = false
            return await this.computeOptimalRoute()
        } else {
            let station = this.evStations.find(element => element.visited === false);
            if (station === undefined) {
                for (const station of this.evStations) {
                    station.visited = false
                }
                station = this.evStations.find(element => element.visited === false);
            }
            const index = this.evStations.indexOf(station)
            this.evStations[index].visited = true
            const newStationLocation = [station.position.lat, station.position.lon]
            const endpointURLFirst = this.getEndpointURL(this.startPoint[0], this.startPoint[1], newStationLocation[0], newStationLocation[1], this.currentChargeInkWh)
            let body = {json: this.carParams}
            let optimalRouteFirst = await this.makeOptimalRouteApiCall(endpointURLFirst, body)
            const endpointURLSecond = this.getEndpointURL(newStationLocation[0], newStationLocation[1], this.endPoint[0], this.endPoint[1], this.maxChargeInkWh)
            let optimalRouteSecond = await this.makeOptimalRouteApiCall(endpointURLSecond, body)
            this.optimalRoute = optimalRouteFirst
            this.optimalRoute.routes[0].summary.lengthInMeters += optimalRouteSecond.routes[0].summary.lengthInMeters
            this.optimalRoute.routes[0].summary.travelTimeInSeconds += optimalRouteSecond.routes[0].summary.travelTimeInSeconds
            this.optimalRoute.routes[0].legs.push(...optimalRouteSecond.routes[0].legs)
            this.actualRouteTravelTime = this.optimalRoute.routes[0].summary.travelTimeInSeconds
            return this.optimalRoute
        }
    }

    async generateStationsObject(start_point, end_point, categories){
        this.startPoint = [start_point.lat,start_point.lng]
        this.endPoint = [end_point.lat,end_point.lng]
        let es = new EVSearcher(this.startPoint, this.endPoint);
        let ps = new POISearcher('pedestrian', 1800);
        console.log("Prepare variables...")
        let ev_stations = {results: []}
        let routeCoordsList = []
        let stationsCoordsList = []


        console.log("Get first (optimal) route...")
        let optimal_route = await this.computeOptimalRoute()
        let pts = await this.getPointsOfOptimalRoute()


        console.log("Get route's EV stations and add to list...")
        for (const leg of optimal_route.routes[0].legs) {
            for (const point of leg.points) {
                routeCoordsList.push([point.longitude, point.latitude])
            }
            stationsCoordsList.push([leg.points.at(-1).longitude, leg.points.at(-1).latitude])
        }
        let optimal_pois = await es.batchLatLonSearch(stationsCoordsList)
        for (const poi of optimal_pois.batchItems) {
            ev_stations.results.push(poi.response.results[0])
        }

        console.log("Replacing legs and searching for EV stations again...")
        es.replaceRouteLegs(pts)

        let stations2 = await es.computeEVs()
        // console.log(stations2.results)
        for (const station of stations2.results) {
            ev_stations.results.push(station)
        }

        console.log("Calculating reachable range...")
        let poly1 = await ps.calculateBatchPolygons(ev_stations)
        let i1 = 0
        for (let element of poly1.batchItems) {
            ev_stations.results[i1].reachableRange = element.response.reachableRange.boundary
            // console.log(element.response.reachableRange.boundary)
            i1++
        }
        console.log("Batch search POIs...")
        let pois1 = await ps.searchBatchPois(ev_stations.results)
        let k1 = 0

        for (let poi_list of pois1.batchItems) {
            let p = poi_list.response.results
            ev_stations.results[k1].pois = p

            // Summary for pois
            let categories_count = {}
            for (let poi of p) {
                let category_id = poi.poi.categorySet[0].id.toString()
                console.log(category_id)
                if (category_id in categories_count) {
                    categories_count[category_id]++
                } else {
                    categories_count[category_id] = 1
                }
            }
            ev_stations.results[k1].pois_summary = categories_count
            console.log(categories_count)
            k1++
        }

        // let stations = await es.computeEVs()
        // // console.log(stations.results)
        // for (const station of stations.results) {
        //     ev_stations.results.push(station)
        // }


        console.log("Replacing stations in RouteGenerator...")
        console.log(ev_stations)
        console.log("markStationsAsVisited")
        await this.markStationsAsVisited(ev_stations.results)
        console.log("markPoisAsNotVisited...")
        await this.markPoisAsNotVisited()
        this.evStations = ev_stations.results
    }

    async prepareRouteOffer(ev_stations) {
        await this.getNextRoute()
        const POIsOnRoute = []
        for (const leg of this.optimalRoute.routes[0].legs) {
            if (leg.summary.chargingInformationAtEndOfLeg !== undefined) {
                const postalCode = leg.summary.chargingInformationAtEndOfLeg.chargingParkLocation.postalCode
                const station = this.evStations.find(element => element.address.postalCode === postalCode);

                if (station !== undefined) {
                    if (station.pois.length > 0) {
                        const proposedPOI = await this.selectPOINearStation(station)
                        leg.proposedPoi = proposedPOI
                    }
                }
            }
        }
        return this.optimalRoute
    }

    async selectPOINearStation(station) { //POI selection from given station later
        const POI = station.pois.find(element => element.visited === false);
        console.log(this.evStations)
        console.log(station)
        console.log(POI)
        console.log("TUUUTEJ!!!!!!")
        const index = station.pois.indexOf(POI)
        console.log(index)
        if (index !== -1) {
            station.pois[index].visited = true
            const POILocation = [POI.position.lat, POI.position.lon]
            const stationLocation = [station.position.lat, station.position.lon]
            const ws = new WalkSimulator(stationLocation, POILocation)
            const route = await ws.computeWalkRoute()

            POI.route = route
        }
        return POI
    }
    prettifyCodeName(string)
    {
        return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()).replace('_',' ');
    }

    async markStationsAsVisited(stations) {
        this.evStations = stations
        for (const leg of this.optimalRoute.routes[0].legs) {
            if (leg.summary.chargingInformationAtEndOfLeg !== undefined) {
                const postalCode = leg.summary.chargingInformationAtEndOfLeg.chargingParkLocation.postalCode
                const station = this.evStations.find(element => element.address.postalCode === postalCode);
                const index = this.evStations.indexOf(station)
                this.evStations[index].visited = true
            }
        }
        this.optimalRouteTravelTime = this.optimalRoute.routes[0].summary.travelTimeInSeconds
        this.actualRouteTravelTime = this.optimalRouteTravelTime
        return this.optimalRoute
    }


    async markPoisAsNotVisited() {
        // console.log(this.evStations)
        for (let station of this.evStations) {
            station.visited = false
            for (let poi of station.pois) {
                poi.visited = false
            }
        }
        return this.evStations
    }
    createInfoSummary(routes){
        let infoSummary = []
        console.log(routes)
        for (const route of routes){
            let routeDict = {}
            routeDict.duration = route.routes[0].summary.travelTimeInSeconds
            routeDict.distance = route.routes[0].summary.lengthInMeters
            routeDict.stops = []
            let i = 0
            for (const leg of route.routes[0].legs){
                if(leg.summary.chargingInformationAtEndOfLeg!==undefined) {
                    let stopDescription = {}
                    if (leg.proposedPoi !== undefined) {
                        stopDescription.name = this.prettifyCodeName(leg.proposedPoi.poi.classifications[0].code)
                    } else {
                        stopDescription.name = "Reading time!"
                    }
                    stopDescription.arrivalTime = leg.summary.arrivalTime
                    routeDict.stops.push(stopDescription)
                    stopDescription.legNum = i
                }
                i++
            }
            infoSummary.push(routeDict)
        }
        return infoSummary
    }

    async computeAllRouteOffers(numOffers = 3){
        let routes = []

        await this.markPoisAsNotVisited()
        for(let i = 0; i < numOffers; i++){
            routes.push(await this.prepareRouteOffer())

        }
        this.offeredRoutes = routes
        return this.createInfoSummary(this.offeredRoutes)
    }

}

export const RG = new RouteGenerator()