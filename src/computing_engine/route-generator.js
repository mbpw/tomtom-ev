import ky from 'ky';
import {car_params, pois_in_city, ev_stations, optimal_route} from './temp_data';
import {WalkSimulator} from "./walk-simulator";

const endpoint = 'https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/';
const vehicleEngineType = 'electric'
const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';
export class RouteGenerator {
    constructor(startPoint = [50,21], endPoint = [45,20], constantSpeedConsumptionInkWhPerHundredkm ="32,10.87:77,18.01", currentChargeInkWh=20, maxChargeInkWh=40, minChargeAtDestinationInkWh=4,minChargeAtChargingStopsInkWh=4, POIs = null, evStations = null) {
        this.startPoint = startPoint
        this.endPoint = endPoint
        this.constantSpeedConsumptionInkWhPerHundredkm = constantSpeedConsumptionInkWhPerHundredkm
        this.currentChargeInkWh = currentChargeInkWh
        this.maxChargeInkWh = maxChargeInkWh
        this.minChargeAtDestinationInkWh = minChargeAtDestinationInkWh
        this.minChargeAtChargingStopsInkWh = minChargeAtChargingStopsInkWh
        this.optimalRouteGoodEnough = true
        this.POIs = pois_in_city.results
        for (const POI of this.POIs){
            POI.visited = false
        }
        this.evStations = ev_stations.results
        for (const station of this.evStations){
            station.visited = false
        }
        this.optimalRoute = null
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
        console.log(points)
        return points
    }

    async getNextRoute(){
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

            return this.optimalRoute
        }
    }

    async prepareRouteOffer(){
        // const route = await this.getNextRoute()
        const POIsOnRoute = []
        const firstLeg = this.optimalRoute.routes[0].legs[0] //iterate over all legs later
        // const stationName = firstLeg.summary.chargingInformationAtEndOfLeg.chargingParkName //get POI by station name later
        const stationName ='Total Schwielowsee Am Bahnhof Lienewitz'
        const station = this.evStations.find(element => element.poi.name === stationName);
        const proposedPOI = await this.selectPOINearStation(station)
        POIsOnRoute.push(proposedPOI)
        return {route:this.optimalRoute, POIs: POIsOnRoute}
    }

    async selectPOINearStation(station){ //POI selection from given station later
        const POI = this.POIs.find(element => element.visited === false);
        const index = this.POIs.indexOf(POI)
        this.POIs[index].visited = true
        const POILocation = [POI.position.lat,POI.position.lon]
        const stationLocation = [station.position.lat,station.position.lon]
        const ws = new WalkSimulator(stationLocation,POILocation)
        const route = await ws.computeWalkRoute()

        POI.route = route
        return POI
    }

}