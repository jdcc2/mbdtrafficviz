/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
//https://mikewilliamson.wordpress.com/2016/02/24/using-mapbox-gl-and-webpack-together/
import OSMStyle from '../mapstyles/osmbright_style.js'
import {getGeoJSON, closestRoad, roadSegment, lineToPolygon} from '../helpers.js'
import sampledata from '../sampledata.json'
import moment from 'moment'

mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZXdpbGxpYW1zb24iLCJhIjoibzRCYUlGSSJ9.QGvlt6Opm5futGhE5i-1kw';

let polygon = null;
let polygonPaint = {
    'fill-extrusion-color': '#ffffff',
    'fill-extrusion-height': 100,
    'fill-extrusion-base': 50,
};
let polygonFeature = null;

getGeoJSON(4.41788, 52.1431, 14).then((data) => {
    console.log(data);
    let roadData = closestRoad(data, 4.41788, 52.1431);
    let segment = roadSegment(roadData.line, roadData.lineLocation, 0.4);
    polygon = lineToPolygon(segment, 0.05);


}).catch((error) => {
    console.log(error);
});

console.log(sampledata[0]);

function getTimeFrame(data) {
    let start = null;
    let end = null;
    for(let value of data) {
        let dataItems = value.trafficJams;
        for(let item of dataItems ) {
            let time = moment(item.measurementTime);
            if(!start) {
                start = time;
            } else if(time.isBefore(start)) {
                start = time;
            }
            if(!end) {
                end = time;
            } else if(time.isAfter(end)) {
                end = time;
            }

        }

    }
    console.log(start, end);
    return [start, end];
}

function getTimeFrameSite(siteData) {
    //Extract the first (and only) key from the site data object
    let dataItems = siteData.trafficJams;
    let start = null;
    let end = null;
    for(let item of dataItems ) {
        let time = moment(item.measurementTime);
        if(!start) {
            start = time;
        } else if(time.isBefore(start)) {
            start = time;
        }
        if(!end) {
            end = time;
        } else if(time.isAfter(end)) {
            end = time;
        }

    }
    return [start, end];
}

//starttime - moment (minute accuracy)
//datapoints from currentTime to nrOfLayers * minute in the past
function generateLayersForSite(siteData, currentTime, nrOfLayers, layerHeight, spacing, polygon) {
    let dataItems = siteData.trafficJams;
    let polygonPaint = {
        'fill-extrusion-color': '#ffffff',
        'fill-extrusion-height': 100,
        'fill-extrusion-base': 50,
    };

    let startInterval = currentTime.clone().subtract(nrOfLayers, 'minutes')
    let endInterval = currentTime;
    console.log(`startInterval: ${startInterval.toISOString()}, endInterval: ${endInterval.toISOString()}`)
    //one minute intervals
    let dataPoints = dataItems.filter((dataItem) => {
        return moment(dataItem.measurementTime).isBetween(startInterval, endInterval, 'minute', '[]');
    });
    //Loop over the time interval, finds a corresponding data point if available, if not available render green box (no traffic jam)
    let layers = [];
    let renderTime = endInterval.clone()
    for(let i = 0; i <= nrOfLayers; i++) {
        let extrusionBase = 10 + (i * (layerHeight + spacing));
        let extrusionHeight = extrusionBase + layerHeight;

        //find a data point for the current minutes
        let currentDataPoint = dataPoints.find((dp) => {
            return moment(dp.measurementTime).isSame(renderTime, 'minute');
        });
        if(currentDataPoint) { //create layer based on data
            console.log(`renderTime: ${renderTime.toISOString()}, extrusion base: ${extrusionBase}, extrusion height: ${extrusionHeight}, rendered red segment`);
            layers.push({
                id : `${siteData.measurementSiteId}_${renderTime.format('YYYY_MM_DD_hh_mm')}`,
                type: 'fill-extrusion',
                source: {
                    type: 'geojson',
                    data: polygon
                },
                paint: {
                    'fill-extrusion-color': '#ff4123',
                    'fill-extrusion-opacity' : 0.5,
                    'fill-extrusion-height': extrusionHeight,
                    'fill-extrusion-base': extrusionBase, //inital spacing + spacing between layer
                }
            })
        } else { //create default layer
            console.log(`renderTime: ${renderTime.toISOString()}, extrusion base: ${10 + (i * (layerHeight + 10))}, rendered green segment`);

            layers.push({
                id : `${siteData.measurementSiteId}_${renderTime.format('YYYY_MM_DD_hh_mm')}`,
                type: 'fill-extrusion',
                source: {
                    type: 'geojson',
                    data: polygon
                },
                paint: {
                    'fill-extrusion-color': '#1aff0c',
                    'fill-extrusion-opacity' : 0.5,
                    'fill-extrusion-height': extrusionHeight,
                    'fill-extrusion-base': extrusionBase, //inital spacing + spacing between layer
                }
            })
        }
        renderTime.subtract(1, 'minutes');
    }
    console.log(layers);
    return layers;
}

let [start, end] = getTimeFrameSite(sampledata[0]);
console.log(end);
generateLayersForSite(sampledata[0], end, 10, 10);



let style = OSMStyle;
//Set source to local vector tile server
style.sources = {
    "openmaptiles": {
        "type": "vector",
        "url": "http://localhost:8070/data/v3.json"
    }
};



function calculateDataPolygon(datapoint) {
    //get the closest road from the GeoJSON
    //get the point on the road closest to point using turf.pointOnline()
    //Get a stretch of line using turf.lineSlice()
    //Convert the stretch of line to a polygon with correct fill extrusion
    //turf.bboxPolygon()


    //return the polygon

}

let datapoint = {'lane': 'lane2', 'measurementSiteId': 'GEO02_R_RWSTI610', 'measurementTime': '2017-01-20T06:11:00Z', 'period': 60.0, 'longitude': 4.41788, 'nrOfLanes': '2', 'measurementSiteName': 'R_RWS_0610', 'latitude': 52.1431, 'averageFlow': 12.0, 'averageSpeed': 32.0};

//Find the

/**
 * WARNING: the map component used longitude, latitude format for coordinates :/
 */
class MapGL extends Component {

    constructor() {
        super();
        this.state = {
            sitePolygons: {},
            selectedSite: null
        }
    }

    renderSite(siteData) {
        //fetch the polygon if it is not cached yet
        console.log('renderSite')
        console.log(siteData);
        if(!this.state.sitePolygons.hasOwnProperty(siteData.measurementSiteId) && siteData.trafficJams.length > 0) {
            getGeoJSON(siteData.trafficJams[0].longitude, siteData.trafficJams[0].latitude, 14).then((data) => {
                console.log(data);
                let roadData = closestRoad(data, 4.41788, 52.1431);
                let segment = roadSegment(roadData.line, roadData.lineLocation, 0.4);
                polygon = lineToPolygon(segment, 0.05);
                let obj = {};
                obj[siteData.measurementSiteId] = polygon;
                this.setState({
                    sitePolygons: Object.assign({}, this.state.sitePolygons, obj)
                });
                return polygon;

            }).then((p) => {
                console.log(`yoeloeleo: ${p}`);
                let [start, end] = getTimeFrameSite(siteData);
                if(p) {
                    let layers = generateLayersForSite(siteData, end, 10, 40, 30, polygon);
                    layers.forEach((layer) => {
                        this.state.map.addLayer(layer);
                    });
                } else {
                    console.log('Could not calculate polygon for site data')
                }
            }).catch((error) => {
                console.log(error);
            });
        } else if (this.state.sitePolygons.hasOwnProperty(siteData.measurementSiteId)){
            let polygon = this.state.sitePolygons[siteData.measurementSiteId];
            let [start, end] = getTimeFrameSite(siteData);
            if(p) {
                let layers = generateLayersForSite(siteData, end, 10, 40, 30, polygon);
                layers.forEach((layer) => {
                    this.state.map.addLayer(layer);
                });
            } else {
                console.log('Could not calculate polygon for site data')
            }
        } else {
            console.log('could not render site, no data points')
        }




    }

    removeSiteData(measurementSiteId) {

    }

    componentDidMount() {
        this.setState({
            map: new mapboxgl.Map({
                    container: 'map', // container id
                    style: style, //stylesheet location
                    center: [5.175500, 52.078689], // starting position
                    zoom: 8, // starting zoom
                    pitch: 30
                })
        }, () => {
            this.state.map.on('load', () => {
                // map.addLayer({
                //     "id": "park-volcanoes",
                //     "type": "circle",
                //     "source": {
                //         type: 'geojson',
                //         data: {
                //             type: 'FeatureCollection',
                //             features: [
                //                 {
                //                     "type": "Feature",
                //                     "geometry": {
                //                         "type": "Point",
                //                         "coordinates": [4.41788, 52.1431]
                //                     }
                //                 },
                //             ]
                //         }
                //     },
                //     "paint": {
                //         "circle-radius": 6,
                //         "circle-color": "#B42222"
                //     },
                // });
                this.renderSite(sampledata[0]);
                this.state.map.addLayer({
                    id : 'viz',
                    type: 'fill-extrusion',
                    source: {
                        type: 'geojson',
                        data: polygon
                    },
                    paint: polygonPaint
                });
            });
        });


    }

    render() {
        return <div style={{ height: '720px'}} id="map"></div>;
    }
}

export default MapGL;
