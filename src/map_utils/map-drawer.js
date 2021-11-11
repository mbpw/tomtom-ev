import {globalMap} from "../store";
import {categories} from "../AppScreens/Stops/categories";
import tt from "@tomtom-international/web-sdk-maps";
import {element} from "svelte/internal";

export class MapDrawer{
    constructor() {
        this.routeLayerId = '0'
        this.walkRouteIds = []
        this.EVStations = []
        this.Pois = []
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
                // map.setCenter(coordinates[Math.ceil(coordinates.length/2)]);
                // map.setZoom(7);
                let routeCenter = new tt.LngLat(coordinates[Math.ceil(coordinates.length/2)][0],coordinates[Math.ceil(coordinates.length/2)][1])
                requestAnimationFrame(timestamp => this.zoomToPointAnimate(timestamp,window.performance.now(),2500,8, map.getZoom(),routeCenter,map.getCenter(),map));
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

    createMarker(icon, color = '#ffffff') { //Not Working
        let markerElement = document.createElement('div');
        markerElement.className = 'marker';
        let markerContentElement = document.createElement('div');
        // markerContentElement.className = 'marker-content';
        // markerContentElement.style.backgroundColor = color;
        markerElement.appendChild(markerContentElement);
        let iconElement = document.createElement('div');
        iconElement.className = 'marker-icon';
        iconElement.innerHTML = `<img src=${icon}>`
        markerContentElement.appendChild(iconElement);
        // add marker to map
        return new tt.Marker({element: markerElement, anchor: 'bottom'})

    }

    drawEVStationOnMap(coordinates, stationInfo = undefined, removePrevious = true){
        if (removePrevious){
            for (const marker of this.EVStations){
                marker.remove()
            }
            this.EVStations = []
        }
        globalMap.update(map => {
            let i = 0
            for (const coordinate of coordinates) {
                console.log(coordinate)
                let marker = this.createMarker('/public/mapIcons/station.svg',"#d20c0c").setDraggable(false).setLngLat(coordinate)
                // let markerElement = document.createElement('div');
                // markerElement.innerHTML = "<img src='/public/icons/gps.svg' style='offset: 100px'>";
                // let marker = new tt.Marker({element: markerElement,
                //     color: "#43d20c", offsetTop: 300, offsetHeight:300
                // }).setLngLat(coordinate).setDraggable(false)
                // marker.getElement().innerHTML = "<img src='/public/icons/gps.svg'>";
                console.log(marker)
                marker.addTo(map)
                if(stationInfo!==undefined) {
                    let popup = new tt.Popup({offset: 40}).setHTML(`<b>Charging Station</b><br/>Name: ${stationInfo[i].chargingParkName}<br />Voltage: ${stationInfo[i].chargingConnectionInfo.chargingVoltageInV}V<br />Current: ${stationInfo[i].chargingConnectionInfo.chargingCurrentInA}A<br />Planned Charging time: ${Math.round(stationInfo[i].chargingTimeInSeconds / 60)}min`);
                    marker.setPopup(popup)
                }
                i++
                this.EVStations.push(marker)
        }
            return map
        })
    }

    prettifyCodeName(string)
    {
        return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()).replaceAll('_',' ');
    }

    zoomToPointAnimate(timestamp,startTimestamp,duration, zoom,initZoom,location,initLocation, map){
        let currDuration = timestamp-startTimestamp
        if(currDuration < duration) {
            let actualZoom = undefined
            if(zoom > initZoom)
                actualZoom = initZoom-(initZoom-zoom)*(currDuration/duration)
            else
                actualZoom = initZoom+(zoom-initZoom)*(currDuration/duration)
            let lonDiff = location.lng-initLocation.lng
            let latDiff = location.lat-initLocation.lat
            let dist = Math.sqrt(lonDiff*lonDiff+latDiff*latDiff)
            let frac = (currDuration/duration)*dist
            let actualLon = initLocation.lng+lonDiff*(frac/dist)
            let actualLat = initLocation.lat+latDiff*(frac/dist)
            map.setCenter([actualLon,actualLat]);
            map.setZoom(actualZoom);
            requestAnimationFrame(timestamp => this.zoomToPointAnimate(timestamp, startTimestamp,duration,zoom, initZoom,location,initLocation, map));
        }
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
            requestAnimationFrame(timestamp => this.zoomToPointAnimate(timestamp,window.performance.now(),2500,15, map.getZoom(),poiMarker.marker.getLngLat(),map.getCenter(),map));
            return map
        })}

    zoomAndToggleStation(stationCoords){
        let stationCoordsLngLat = new tt.LngLat(stationCoords[0],stationCoords[1])
        globalMap.update(map => {
            let stationMarker = this.EVStations.find(stationMarker=>JSON.stringify(stationMarker.getLngLat())===JSON.stringify(stationCoordsLngLat))
            stationMarker.togglePopup()
            requestAnimationFrame(timestamp => this.zoomToPointAnimate(timestamp,window.performance.now(),2500,15, map.getZoom(),stationMarker.getLngLat(),map.getCenter(),map));
            return map
        })}

    zoomStart(){
        globalMap.update(map => {
            requestAnimationFrame(timestamp => this.zoomToPointAnimate(timestamp,window.performance.now(),2500,15, map.getZoom(),this.startPoint.getLngLat(),map.getCenter(),map));
            return map
        })}

    zoomEnd(){
        globalMap.update(map => {
            requestAnimationFrame(timestamp => this.zoomToPointAnimate(timestamp,window.performance.now(),2500,15, map.getZoom(),this.endPoint.getLngLat(),map.getCenter(),map));
            return map
        })}

    findCategoryIcon(categoryId){
        for(let category of categories){
            let any_category = category.options.find(element => element.name === 'Any')
            let ids = any_category.category_id.split(',').map(Number)
            if(ids.includes(categoryId))
                return category.icon
        }
    }

    drawPoisOnMap(pois, removePrevious = true){
        if (removePrevious){
            for (const poi of this.Pois){
                poi.marker.remove()
            }
            this.Pois = []
        }
        globalMap.update(map => {
            for (const poi of pois) {
                // let marker = new tt.Marker({
                //     color: "#186bbd"
                // }).setLngLat(poi.position).setDraggable(false)
                let poiCategoryId = poi.poi.categorySet[0].id
                let categoryIcon = this.findCategoryIcon(poiCategoryId)
                categoryIcon = categoryIcon.replace('icons','mapIcons')
                let marker =this.createMarker(categoryIcon).setLngLat(poi.position).setDraggable(false)
                marker.addTo(map)
                let popup = new tt.Popup({offset:40}).setHTML(`<b>${this.prettifyCodeName(poi.poi.classifications[0].code)}</b><br/>Name: ${poi.poi.name}<br />${poi.poi.phone!==undefined?"Phone: "+poi.poi.phone:''}<br />
Distance from station: ${poi.route[0].summary.lengthInMeters}m<br />Travel time on foot: ${Math.round(poi.route[0].summary.travelTimeInSeconds/60)}min`);
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

            // this.startPoint = new tt.Marker({
            //     color: "#000000"
            // }).setLngLat(startCoordinates).setDraggable(false)
            this.startPoint = this.createMarker('/public/mapIcons/start.svg',"#d20c0c").setDraggable(false).setLngLat(startCoordinates)
            this.startPoint.addTo(map)

            // this.endPoint = new tt.Marker({
            //     color: "#ffffff"
            // }).setLngLat(stopCoordinates).setDraggable(false)
            this.endPoint = this.createMarker('/public/mapIcons/end.svg',"#d20c0c").setDraggable(false).setLngLat(stopCoordinates)
            this.endPoint.addTo(map)

            return map
        })}

    clearMapDoZera() {

        for (const marker of this.EVStations) {
            marker.remove()
        }
        for (const poi of this.Pois) {
            poi.marker.remove()
        }
        this.EVStations = []
        this.Pois = []
        globalMap.update(map => {
            console.log(map)
            if (this.routeLayerId!=='0') {
                map.removeLayer(this.routeLayerId)
            }
        return map})
    }

    drawWholeRouteOnMap(route){
        let pointsList = []
        let stationsList = []
        let stationsCoordsList = []
        let poisList = []
        this.clearWalkRoutes()
        for (const leg of route.routes[0].legs) {
            for (const point of leg.points) {
                pointsList.push([point.longitude, point.latitude])
            }
            if (leg.summary.chargingInformationAtEndOfLeg!==undefined) {
                stationsCoordsList.push([leg.points.at(-1).longitude, leg.points.at(-1).latitude])
                stationsList.push(leg.summary.chargingInformationAtEndOfLeg)
            }
            if (leg.proposedPoi!==undefined)
                poisList.push(leg.proposedPoi)

        }
        console.log(stationsList)
        console.log('drawing route')
        this.drawRouteOnMap(pointsList, true, true)
        console.log('drawing stations')
        this.drawEVStationOnMap(stationsCoordsList,stationsList)
        console.log('drawing pois')
        this.drawPoisOnMap(poisList)

        let startCoords = route.routes[0].legs[0].points.at(0)
        let stopCoords = route.routes[0].legs.at(-1).points.at(-1)
        this.drawStartandStopOnMap([startCoords.longitude,startCoords.latitude],[stopCoords.longitude,stopCoords.latitude])

        for (const leg of route.routes[0].legs){
            console.log(leg)
            if(leg.proposedPoi !== undefined) {
                console.log(leg.proposedPoi)
                let walkPointsList = []
                for (const point of leg.proposedPoi.route[0].legs[0].points) {
                    walkPointsList.push([point.longitude, point.latitude])
                }
                this.drawWalkRouteOnMap(walkPointsList)
                walkPointsList = []
            }
        }
    }
}

export const MD = new MapDrawer()