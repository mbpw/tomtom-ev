import ky from 'ky';

const endpoint_range = 'https://api.tomtom.com/routing/1/calculateReachableRange/';
const endpoint_search = 'https://api.tomtom.com/search/2/geometrySearch/';

const key = 'KSiA3cYn3i5bjlooe5NlxW5tR5uF0t7P';

/*
Input: [{"latitude": 46.37433, "longitude": 19.99664}, {"latitude": 46.37488,"longitude": 19.99635}, ...]
Output: ["46.37433, 19.99664", "46.37488, 19.99635"]
 */
function parseGeom(geom) {
    let points = [];
    console.log(geom)
    geom.forEach((element) => {
        points.push(""+element.latitude+","+element.longitude);
    });
    console.log(points)
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
        return endpoint_search + query + ".json?key=" + key + '&limit=' + limit;
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
        let url = this.getRangeEndpointURL(lat, lon)
        let poly = await this.makeApiGetCall(url)
        console.log(poly)
        return poly
    }

    async computePOIs(query = null, geom = null) {
        if (geom === null) {
            console.log("Geometry not included in the call!")
        }
        let url = this.getGeomSearchEndpointURL(query)
        console.log(parseGeom(geom))
        let g = {
            "geometryList": [
                {
                    "type": "POLYGON",
                    "vertices": parseGeom(geom)
                }]
        }
        let body = {json: g}
        let pois = await this.makeApiPostCall(url, body)
        console.log(pois)
        return pois
    }
}