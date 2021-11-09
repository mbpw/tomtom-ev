import {globalMap} from "../store";
import tt from "@tomtom-international/web-sdk-maps";

export class MapDrawer{
    constructor() {
        this.routeLayerId = '0'
        this.EVStations = []
    }
    drawRouteOnMap(coordinates, removePrevious = true, moveCamera = true){
        globalMap.update(map => {
            console.log(map)
            if (this.routeLayerId!=='0' && removePrevious) {
                map.removeLayer(this.routeLayerId)
            }
            this.routeLayerId = (parseInt(this.routeLayerId)+1).toString()
            map.addLayer({
                id: this.routeLayerId,
                type: "line",
                source: {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: {
                                    type: "LineString",
                                    properties: {},
                                    coordinates: coordinates

                                }
                            }
                        ]
                    }
                },
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#ff0000",
                    "line-width": 2
                }
            })
            if(moveCamera) {
                map.setCenter(coordinates[0]);
                map.setZoom(10);
            }
            return map
        });
    }

    drawEVStationOnMap(coordinates, removePrevious = true){
        if (removePrevious){
            for (const marker of this.EVStations){
                marker.remove()
            }
            this.EVStations = []
        }
        globalMap.update(map => {
            for (const coordinate of coordinates) {
                console.log(coordinate)
                let marker = new tt.Marker().setLngLat(coordinate).setDraggable(false)
                marker.addTo(map)
                this.EVStations.push(marker)
        }
            return map
        })}

    clearMapDoZera() {

        for (const marker of this.EVStations) {
            marker.remove()
        }
        this.EVStations = []
        globalMap.update(map => {
            console.log(map)
            if (this.routeLayerId!=='0') {
                map.removeLayer(this.routeLayerId)
            }
        return map})
    }
}