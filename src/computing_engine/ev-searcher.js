import ky from 'ky';

const endpoint = 'https://api.tomtom.com/search/2/searchAlongRoute/';

const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';

let latitudeLatParser = (route) => {
    let points = [];
    route.forEach((element) => {
        points.push({lat: element.latitude, lon: element.longitude});
    });
    return {route: {points: points}};
};


export class EVSearcher {
    constructor(startPoint, endPoint, maxDetourTime) {
        this.legs = [
                {
                    "latitude": startPoint[0],
                    "longitude": startPoint[1]
                },
                {
                    "latitude": endPoint[0],
                    "longitude": endPoint[1]
                }];
        this.evList = [];
        this.maxDetourTime = maxDetourTime;
    }

    getEndpointURL(maxDetourTime = 3600) {
        return endpoint + 'electric.json?key=' + key + '&maxDetourTime=' + maxDetourTime + '&categorySet=7309&limit=20'
    }

    replaceRouteLegs(legs) {
        this.legs = legs
    }

    async makeSearchAlongRouteApiCall(endpoint, body){
        console.log(endpoint)
        return await Promise.resolve(ky.post(endpoint, body).json())
    }

    async computeEVs(){
        console.log("Compute EVs()...")
        let body = {json: this.parsePls()}
        let endpointURL = this.getEndpointURL(3600)
        // let body = {json: car_params}
        let evList = await this.makeSearchAlongRouteApiCall(endpointURL, body)
        this.evList = evList
        console.log(evList)
        return this.evList
    }

    parsePls() {
        // console.log(this.legs)
        let res = latitudeLatParser(this.legs);
        // console.log(JSON.stringify(res))
        return res
    }
}