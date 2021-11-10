import {globalMap} from "../store";
import tt from "@tomtom-international/web-sdk-maps";

export class MapDrawer{
    constructor() {
        this.routeLayerId = '0'
        this.walkRouteIds = []
        this.EVStations = []
        this.Pois = []
        this.experimentalPoi = undefined
        this.startPoint = undefined
        this.endPoint = undefined
    }
    drawRouteOnMap(coordinates, removePrevious = true, moveCamera = true){
        globalMap.update(map => {
            console.log(map)
            if (this.routeLayerId!=='0' && removePrevious) {
                map.removeLayer(this.routeLayerId)
            }
            this.routeLayerId = (this.giveRandomId(1,10000)).toString()
            console.log('ROUTE ID: ' + this.routeLayerId)
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

    giveRandomId(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    drawWalkRouteOnMap(coordinates){
        globalMap.update(map => {
            console.log(map)
            this.walkRouteIds.push((this.giveRandomId(10000,100000)).toString())
            console.log('ROUTE ID: ' + this.walkRouteIds.at(-1))
            map.addLayer({
                id: this.walkRouteIds.at(-1),
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
                    "line-color": "#00ffd9",
                    "line-width": 2
                }
            })
            return map
        });
    }

    clearWalkRoutes(){
        if (this.walkRouteIds!==[]) {
            globalMap.update(map => {
                for (const route of this.walkRouteIds) {
                    console.log(route)
                    map.removeLayer(route)
                }
                this.walkRouteIds = []
                return map
            })
        }
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
                let marker = new tt.Marker({
                    color: "#43d20c"
                }).setLngLat(coordinate).setDraggable(false)
                marker.addTo(map)
                this.EVStations.push(marker)
        }
            return map
        })
    }

    prettifyCodeName(string)
    {
        return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()).replace('_',' ');
    }
    zoomAndTogglePoi(poi){
        for(const markerPoi of this.Pois){
            if(markerPoi.toggled){
                markerPoi.marker.togglePopup()
                markerPoi.toggled=false
            }
        }
        globalMap.update(map => {
            let poiMarker = this.Pois.find(poiMarker=>poiMarker.id===poi.id)
            poiMarker.marker.togglePopup()
            poiMarker.toggled=true
            map.setCenter(poiMarker.marker.getLngLat());
            map.setZoom(16);
            return map
        })}

    drawPoisOnMap(pois, removePrevious = true){
        if (removePrevious){
            for (const poi of this.Pois){
                poi.marker.remove()
            }
            this.Pois = []
        }
        globalMap.update(map => {
            for (const poi of pois) {
                let marker = new tt.Marker({
                    color: "#186bbd"
                }).setLngLat(poi.position).setDraggable(false)

                marker.addTo(map)
                let popup = new tt.Popup({offset:40}).setHTML(`<b>${this.prettifyCodeName(poi.poi.classifications[0].code)}</b><br/>Name: ${poi.poi.name}<br />Distance from station: ${poi.route[0].summary.lengthInMeters}m<br />Travel time on foot: ${Math.round(poi.route[0].summary.travelTimeInSeconds/60)}min`);
                marker.setPopup(popup)
                poi.toggled = false
                poi.marker = marker
                this.Pois.push(poi)
            }
            return map
        })}

    drawStartandStopOnMap(startCoordinates, stopCoordinates){
        if(this.startPoint!== undefined) {
            this.startPoint.remove()
            this.endPoint.remove()
        }
        globalMap.update(map => {

            this.startPoint = new tt.Marker({
                color: "#000000"
            }).setLngLat(startCoordinates).setDraggable(false)
            this.startPoint.addTo(map)

            this.endPoint = new tt.Marker({
                color: "#ffffff"
            }).setLngLat(stopCoordinates).setDraggable(false)
            this.endPoint.addTo(map)

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