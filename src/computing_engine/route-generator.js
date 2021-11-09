import ky from 'ky';
import {car_params, pois_in_city, ev_stations, optimal_route} from './temp_data';
import {WalkSimulator} from "./walk-simulator";

const endpoint = 'https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/';
const vehicleEngineType = 'electric'
const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';
export class RouteGenerator {
    constructor(startPoint = [52,21], endPoint = [49,20], constantSpeedConsumptionInkWhPerHundredkm ="32,10.87:77,18.01", currentChargeInkWh=20, maxChargeInkWh=40, minChargeAtDestinationInkWh=4,minChargeAtChargingStopsInkWh=4, POIs = null, evStations = null) {
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
        this.optimalRoute = null
    }
    getEndpointURL(){
        return endpoint + this.startPoint[0]+','+this.startPoint[1]+':'+this.endPoint[0]+','+this.endPoint[1]+'/json?key='+key+'&vehicleEngineType='+vehicleEngineType+'&constantSpeedConsumptionInkWhPerHundredkm='+this.constantSpeedConsumptionInkWhPerHundredkm+'&currentChargeInkWh='+this.currentChargeInkWh+'&maxChargeInkWh='+this.maxChargeInkWh+'&minChargeAtDestinationInkWh='+this.minChargeAtDestinationInkWh+'&minChargeAtChargingStopsInkWh='+this.minChargeAtChargingStopsInkWh
    }

    async makeOptimalRouteApiCall(endpoint, body){
        console.log(endpoint)
        return await Promise.resolve(ky.post(endpoint, body).json())
    }

    computeOptimalRoute(){
        // let endpointURL = this.getEndpointURL()
        // let body = {json: car_params}
        // this.optimalRoute = this.makeOptimalRouteApiCall(endpointURL, body)
        this.optimalRoute = optimal_route.routes[0].legs
        console.log(this.optimalRoute.length)
        return this.optimalRoute
    }

    getPointsOfOptimalRoute(){
        if (this.optimalRoute == null){
            this.computeOptimalRoute()
        }
        const points = []
        for (const leg of this.optimalRoute){
            points.push(...leg.points)
        }
        console.log(points)
        return points
    }

    getNextRoute(){
        if (this.optimalRouteGoodEnough) {
            return this.optimalRoute
        }
        else
        {
            //not implemented
        }
    }

    async prepareRouteOffer(){
        const route = this.getNextRoute()
        const POIsOnRoute = []
        const firstLeg = route[0] //iterate over all legs later
        const stationName = firstLeg.summary.chargingInformationAtEndOfLeg.chargingParkName //get POI by station name later
        const station = this.evStations.find(element => element.poi.name === stationName);
        const proposedPOI = await this.selectPOINearStation(station)
        POIsOnRoute.push(proposedPOI)
        return {route:route, POIs: POIsOnRoute}
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