/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
//https://mikewilliamson.wordpress.com/2016/02/24/using-mapbox-gl-and-webpack-together/
import OSMStyle from '../mapstyles/osmbright_style.js'
import {getGeoJSON, closestRoad, roadSegment, lineToPolygon} from '../helpers.js'
import sampledata from '../sampledata.js'

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

    componentDidMount() {
        let map = new mapboxgl.Map({
            container: 'map', // container id
            style: style, //stylesheet location
            center: [5.175500, 52.078689], // starting position
            zoom: 8, // starting zoom
            pitch: 30
        });
        map.on('load', () => {
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

            map.addLayer({
                id : 'viz',
                type: 'fill-extrusion',
                source: {
                    type: 'geojson',
                    data: polygon
                },
                paint: polygonPaint
            });
        });

    }

    render() {
        return <div style={{ height: '720px'}} id="map"></div>;
    }
}

export default MapGL;