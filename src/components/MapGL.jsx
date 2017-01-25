/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
//https://mikewilliamson.wordpress.com/2016/02/24/using-mapbox-gl-and-webpack-together/
import OSMStyle from '../mapstyles/osmbright_style.js'
import {tileserver} from '../helpers.js'
import sampledata from '../sampledata.json'
import moment from 'moment'

mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZXdpbGxpYW1zb24iLCJhIjoibzRCYUlGSSJ9.QGvlt6Opm5futGhE5i-1kw';


// let [start, end] = getTimeFrameSite(sampledata[0]);
// console.log(end);
// generateLayersForSite(sampledata[0], end, 10, 10);



let style = OSMStyle;
//Set source to local vector tile server
style.sources = {
    "openmaptiles": {
        "type": "vector",
        "url": tileserver + '.json'
    }
};


/**
 * WARNING: the map component used longitude, latitude format for coordinates :/
 */
class MapGL extends Component {

    constructor() {
        super();
        this.state = {
            sitePolygons: {},
            loaded: false,
            layerIDs : []
        }
    }

    addLayer(layer) {
        //TODO save ID for easy removal,
        if(!this.map.getLayer(layer.id)) {
            this.map.addLayer(layer);
        }
    }

    setPitch(pitch) {
        this.map.setPitch()
    }

    addMarker(marker) {
        console.log(marker);
        marker.addTo(this.map);
    }

    moveTo(lon, lat) {
        this.map.easeTo({
            center: [lon, lat],
            zoom: 14,
            duration: 3000,
            bearing: 0
        });
    }

    recenter() {
        this.map.flyTo({
            center: [5.175500, 52.078689],
            zoom: 8,
            pitch: 30,
            bearing: 0,
            duration: 5000
        });
    }
    //Component should never rerender
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {

        this.map = new mapboxgl.Map({
            container: 'map', // container id
            style: style, //stylesheet location
            center: [5.175500, 52.078689], // starting position
            zoom: 8, // starting zoom
            pitch: 30
        });
        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.on('load', () => {
            this.setState({
                loaded : true
            });
        });

    }

    render() {
        return <div style={{ height: '720px'}} id="map"></div>;
    }
}

export default MapGL;
