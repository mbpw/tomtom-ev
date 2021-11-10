import ky from 'ky';
// import {ev_stations, pois_in_city} from "./temp_data";

const endpoint = 'https://api.tomtom.com/routing/1/calculateRoute/';
const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';
const travelMode = 'pedestrian';

export class WalkSimulator {
    constructor(startPoint = [52, 21], endPoint = [49, 20]) {
        this.startPoint = startPoint
        this.endPoint = endPoint
    }

    async askForRoute(endpoint){

        return await Promise.resolve(ky.get(endpoint).json())
    }

    async computeWalkRoute(){
        let route = await this.askForRoute(this.getEndpointURL())

        return route.routes
    }

    getEndpointURL() {
        return endpoint + this.startPoint[0] + ',' + this.startPoint[1] + ':' + this.endPoint[0] + ',' + this.endPoint[1] + '/json?key=' + key + '&travelMode=' + travelMode
    }
}