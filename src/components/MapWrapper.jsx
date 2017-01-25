import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
//https://mikewilliamson.wordpress.com/2016/02/24/using-mapbox-gl-and-webpack-together/
import OSMStyle from '../mapstyles/osmbright_style.js'
import {getGeoJSON, closestRoad, roadSegment, lineToPolygon, generateLayersForSite, generateMarker, getTimeFrameSite} from '../helpers.js'
import sampledata from '../sampledata.json'
import moment from 'moment'
import MapGL from './MapGL.jsx'


class MapWrapper extends Component {

    constructor() {
        super();
        this.state = {
            sitePolygons: {},
        }
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.renderSite(sampledata[0]);
        }, 1000);
    }

    renderSite(siteData) {
        let polygon = null;
        //fetch the polygon if it is not cached yet
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
                let [start, end] = getTimeFrameSite(siteData);
                if(p) {
                    let layers = generateLayersForSite(siteData, end, 10, 40, 30, polygon);
                    layers.forEach((layer) => {
                        this.mapgl.addLayer(layer);
                    });
                    //add the marker
                    this.mapgl.addMarker(generateMarker(siteData));
                } else {
                    console.log('Could not calculate polygon for site data')
                }
            }).catch((error) => {
                console.log(error);
            });
        } else if (this.state.sitePolygons.hasOwnProperty(siteData.measurementSiteId)){
            polygon = this.state.sitePolygons[siteData.measurementSiteId];
            let [start, end] = getTimeFrameSite(siteData);
            if(p) {
                let layers = generateLayersForSite(siteData, end, 10, 40, 30, polygon);
                layers.forEach((layer) => {
                    this.state.map.addLayer(layer);
                });
                this.mapgl.addMarker(generateMarker(siteData));
            } else {
                console.log('Could not calculate polygon for site data')
            }
        } else {
            console.log('could not render site, no data points')
        }




    }

    removeSiteData(measurementSiteId) {
        this.mapgl.removeLayers(measurementSiteId);
    }

    render() {

        return (
            <div className="columns">
                <div className="column is-three-quarters">
                    <MapGL ref={(mapgl) => this.mapgl = mapgl}/>
                </div>
                <div className="column">
                    Menu stuffs
                </div>
            </div>
        );
    }
}

export default MapWrapper;