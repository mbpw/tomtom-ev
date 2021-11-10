import ky from 'ky';
import {car_params, ev_stations} from './temp_data';
import {WalkSimulator} from "./walk-simulator";

const endpoint = 'https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/';
const vehicleEngineType = 'electric'
const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';



export class RouteGenerator {
    constructor(startPoint = [52.32563573919947, 10.523825676170611], endPoint = [52.509548827862005, 13.62762775333342], constantSpeedConsumptionInkWhPerHundredkm ="32,10.87:77,18.01", currentChargeInkWh=20, maxChargeInkWh=40, minChargeAtDestinationInkWh=4,minChargeAtChargingStopsInkWh=4, POIs = null, evStations = null) {
        this.startPoint = startPoint
        this.endPoint = endPoint
        this.constantSpeedConsumptionInkWhPerHundredkm = constantSpeedConsumptionInkWhPerHundredkm
        this.currentChargeInkWh = currentChargeInkWh
        this.maxChargeInkWh = maxChargeInkWh
        this.minChargeAtDestinationInkWh = minChargeAtDestinationInkWh
        this.minChargeAtChargingStopsInkWh = minChargeAtChargingStopsInkWh
        this.optimalRouteGoodEnough = true
        this.POIs = []//pois_in_city.results
        for (const POI of this.POIs){
            POI.visited = false
        }
        this.evStations = ev_stations.results
        for (const station of this.evStations){
            station.visited = false
            for (const poi of station.pois){
                poi.visited = false
            }
        }
        this.optimalRoute = null
        this.optimalRouteTravelTime = 0
        this.actualRouteTravelTime = 0
        this.offeredRoutes = []
    }
    getEndpointURL(start_x, start_y, stop_x, stop_y, currentCharge){
        return endpoint + start_x+','+start_y+':'+stop_x+','+stop_y+'/json?key='+key+'&vehicleEngineType='+vehicleEngineType+'&constantSpeedConsumptionInkWhPerHundredkm='+this.constantSpeedConsumptionInkWhPerHundredkm+'&currentChargeInkWh='+currentCharge+'&maxChargeInkWh='+this.maxChargeInkWh+'&minChargeAtDestinationInkWh='+this.minChargeAtDestinationInkWh+'&minChargeAtChargingStopsInkWh='+this.minChargeAtChargingStopsInkWh
    }

    async makeOptimalRouteApiCall(endpoint, body){
        console.log(endpoint)
        return await Promise.resolve(ky.post(endpoint, body).json())
    }

    async computeOptimalRoute(){
        let endpointURL = this.getEndpointURL(this.startPoint[0],this.startPoint[1],this.endPoint[0],this.endPoint[1],this.currentChargeInkWh)
        let body = {json: car_params}
        let optimalRoute = await this.makeOptimalRouteApiCall(endpointURL, body)
        this.optimalRoute = optimalRoute
        console.log(this.optimalRoute.routes[0].legs)
        for (const leg of this.optimalRoute.routes[0].legs) {
            if (leg.summary.chargingInformationAtEndOfLeg !== undefined) {
                const postalCode = leg.summary.chargingInformationAtEndOfLeg.chargingParkLocation.postalCode
                const station = this.evStations.find(element => element.address.postalCode === postalCode);
                if (station !== undefined) {
                    const index = this.evStations.indexOf(station)
                    console.log(postalCode)
                    this.evStations[index].visited = true
                }
            }
        }
        this.optimalRouteTravelTime = optimalRoute.routes[0].summary.travelTimeInSeconds
        this.actualRouteTravelTime = this.optimalRouteTravelTime
        return this.optimalRoute
    }

    async getPointsOfOptimalRoute(){
        if (this.optimalRoute == null){
            this.computeOptimalRoute()
        }
        const points = []
        for (const leg of this.optimalRoute.routes[0].legs){
            points.push(...leg.points)
        }
        return points
    }

    async getNextRoute(){
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
        }
        else
        {
            let station = this.evStations.find(element => element.visited === false);
            if (station === undefined){
                for (const station of this.evStations){
                    station.visited = false
                }
                station = this.evStations.find(element => element.visited === false);
            }
            const index = this.evStations.indexOf(station)
            this.evStations[index].visited = true
            const newStationLocation = [station.position.lat,station.position.lon]
            const endpointURLFirst = this.getEndpointURL(this.startPoint[0],this.startPoint[1],newStationLocation[0],newStationLocation[1],this.currentChargeInkWh)
            let body = {json: car_params}
            let optimalRouteFirst = await this.makeOptimalRouteApiCall(endpointURLFirst, body)
            const endpointURLSecond = this.getEndpointURL(newStationLocation[0],newStationLocation[1],this.endPoint[0],this.endPoint[1],this.maxChargeInkWh)
            let optimalRouteSecond = await this.makeOptimalRouteApiCall(endpointURLSecond, body)
            this.optimalRoute = optimalRouteFirst
            this.optimalRoute.routes[0].summary.lengthInMeters += optimalRouteSecond.routes[0].summary.lengthInMeters
            this.optimalRoute.routes[0].summary.travelTimeInSeconds += optimalRouteSecond.routes[0].summary.travelTimeInSeconds
            this.optimalRoute.routes[0].legs.push(...optimalRouteSecond.routes[0].legs)
            this.actualRouteTravelTime = this.optimalRoute.routes[0].summary.travelTimeInSeconds
            return this.optimalRoute
        }
    }

    async prepareRouteOffer(){
        await this.getNextRoute()
        const POIsOnRoute = []
        for (const leg of this.optimalRoute.routes[0].legs){
            if(leg.summary.chargingInformationAtEndOfLeg !== undefined) {
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

    async selectPOINearStation(station){ //POI selection from given station later
        const POI = station.pois.find(element => element.visited === false);
        const index = station.pois.indexOf(POI)
        station.pois[index].visited = true
        const POILocation = [POI.position.lat,POI.position.lon]
        const stationLocation = [station.position.lat,station.position.lon]
        const ws = new WalkSimulator(stationLocation,POILocation)
        const route = await ws.computeWalkRoute()

        POI.route = route
        return POI
    }
    prettifyCodeName(string)
    {
        return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()).replace('_',' ');
    }

    createInfoSummary(routes){
        let infoSummary = []
        console.log(routes)
        for (const route of routes){
            let routeDict = {}
            routeDict.duration = route.routes[0].summary.travelTimeInSeconds
            routeDict.distance = route.routes[0].summary.lengthInMeters
            routeDict.stops = []
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
                }
            }
            infoSummary.push(routeDict)
        }
        return infoSummary
    }

    async computeAllRouteOffers(numOffers = 3){
        let routes = []
        for(let i = 0; i < numOffers; i++){
            routes.push(await this.prepareRouteOffer())
        }
        this.offeredRoutes = routes
        return this.createInfoSummary(this.offeredRoutes)
    }

}

export const RG = new RouteGenerator()