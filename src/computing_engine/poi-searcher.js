import ky from 'ky';

const endpoint_range = 'https://api.tomtom.com/routing/1/calculateReachableRange/';
const endpoint_search = 'https://api.tomtom.com/search/2/geometrySearch/';
const batch_endpoint_range = "https://api.tomtom.com/routing/1/batch/json/";
const batch_endpoint = "https://api.tomtom.com/search/2/batch/sync.json/";

const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';

/*
Input: [{"latitude": 46.37433, "longitude": 19.99664}, {"latitude": 46.37488,"longitude": 19.99635}, ...]
Output: ["46.37433, 19.99664", "46.37488, 19.99635"]
 */
function parseGeom(geom) {
    let points = [];
    // console.log(geom)
    geom.forEach((element) => {
        points.push("" + element.latitude + "," + element.longitude);
    });
    // console.log(points)
    return points;
}

export class POISearcher {
    constructor(travelMode = 'pedestrian', timeBudgetInSec = 1800) {
        this.travelMode = travelMode;
        this.timeBudgetInSec = timeBudgetInSec;

    }

    getRangeEndpointURL(lat, lon) {
        return endpoint_range + lat + "," + lon + "/json?key=" + key + '&timeBudgetInSec=' + this.timeBudgetInSec + '&travelMode=' + this.travelMode;
    }

    getGeomSearchEndpointURL(query = "", limit = 100) {
        return endpoint_search + query + ".json?key=" + key + '&categorySet=7315,9376,7314,9361&limit=' + limit;
    }

    getBatchRangeEndpointURL() {
        return batch_endpoint_range + '?key=' + key
    }

    getBatchSearchEndpointURL() {
        return batch_endpoint + '?key=' + key
    }

    async makeApiPostCall(endpoint, body) {
        console.log(endpoint)
        return await Promise.resolve(ky.post(endpoint, body).json())
    }

    async makeApiGetCall(endpoint) {
        console.log(endpoint)
        return await Promise.resolve(ky.get(endpoint).json())
    }

    async calculatePolygon(lat, lon) {
        let url = this.getRangeEndpointURL()
        let poly = await this.makeApiGetCall(url)
        console.log(poly)
        return poly
    }

    async calculateBatchPolygons(pois) {
        let batch_url = this.getBatchRangeEndpointURL()

        let queries = []
        for (let element of pois.results) {
            let url = "/calculateReachableRange/" + element.position.lat + "," + element.position.lon + '/json?timeBudgetInSec=' + this.timeBudgetInSec + '&travelMode=' + this.travelMode;
            queries.push({"query": url})
        }
        let body = {
            json: {
                "batchItems": queries
            }
        }
        // console.log(JSON.stringify(body))
        // console.log(batch_url)
        return await this.makeApiPostCall(batch_url, body)
    }

    async computePOIs(query = null, geom = null) {
        if (geom === null) {
            console.log("Geometry not included in the call!")
        }
        let url = this.getGeomSearchEndpointURL(query)
        // console.log(parseGeom(geom))
        let g = {
            "geometryList": [
                {
                    "type": "POLYGON",
                    "vertices": parseGeom(geom)
                }]
        }
        let body = {json: g}
        let pois = await this.makeApiPostCall(url, body)
        // console.log(pois)
        return pois
    }

    async searchBatchPois(pois) {
        let url = this.getBatchSearchEndpointURL()
        let batchItems = []

        for (let poi of pois) {
            let geom = poi.reachableRange
            let g = {
                "geometryList": [
                    {
                        "type": "POLYGON",
                        "vertices": parseGeom(geom)
                    }]
            }
            batchItems.push({
                "query": "/geometrySearch/.json?categorySet=7315,9376,7314,9361&limit=100",
                "post": g
            })
        }
        let body = {
            json: {"batchItems": batchItems}
        }
        // console.log(JSON.stringify(post))
        return await this.makeApiPostCall(url, body)
    }
}