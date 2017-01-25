import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
//https://mikewilliamson.wordpress.com/2016/02/24/using-mapbox-gl-and-webpack-together/
import OSMStyle from '../mapstyles/osmbright_style.js'
import {getGeoJSON, closestRoad, roadSegment, lineToPolygon, generateLayersForSite, generateMarker, getTimeFrameSite} from '../helpers.js'
import sampledata from '../sampledata.json'
import moment from 'moment'
import MapGL from './MapGL.jsx'
import TimePicker from 'react-datetime'
import timepickercss from 'react-datetime/css/react-datetime.css'

class MapWrapper extends Component {

    constructor() {
        super();
        this.state = {
            sitePolygons: {},
            sites: [],
            currentTime: moment(),
            selectedTime: moment()
        }
    }

    componentDidMount() {
        // window.setTimeout(() => {
        //     this.renderSite(sampledata[0]);
        // }, 1000);

        this.setState({
            sites: sampledata.slice(0, 100)
        })

    }

    handleTimeChange = (time) => {
        this.setState({
            currentTime: time
        });
    }

    handleTimeSave = (time) => {
        this.setState({
            selectedTime: time
        });
        console.log(time);
    }

    onRecenterClick = () => {
        this.mapgl.recenter();
    }

    onSiteClick = (index) => {
        console.log(index);
        this.renderSite(this.state.sites[index]);
        this.mapgl.moveTo(this.state.sites[index].trafficJams[0].longitude, this.state.sites[index].trafficJams[0].latitude);
    }

    renderSite = (siteData) => {

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
                    let layers = generateLayersForSite(siteData, end, 10, 40, 30, p);
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
            if(polygon) {
                let layers = generateLayersForSite(siteData, end, 10, 40, 30, polygon);
                layers.forEach((layer) => {
                    this.mapgl.addLayer(layer);
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

        let listItems = [];
        this.state.sites.forEach((siteData, index) => {
            let [start, end] = getTimeFrameSite(siteData);
            listItems.push(
                <div className="card" key={index}>
                  <header className="card-header">
                    <p className="card-header-title">
                      {siteData.measurementSiteId}
                    </p>
                  </header>
                  <div className="card-content">
                    <div className="content">
                      Name: {siteData.trafficJams[0].measurementSiteName}
                      <br/>
                      Time shown: {end.format('DD-MM-YYYY hh:mm')}
                    </div>
                  </div>
                  <footer className="card-footer">
                    <a className="card-footer-item">
                        <button className="button" onClick={() => {this.onSiteClick(index)}}>
                            Go to measurement site
                        </button>
                    </a>
                  </footer>
                </div>
            );
        });

        return (
            <div className="columns">
                <div className="column is-three-quarters">
                    <MapGL ref={(mapgl) => {this.mapgl = mapgl; console.log(this.mapgl)}}/>
                </div>
                <div className="column">

                    <nav className="panel">
                        <p className="panel-heading">
                            Measurement sites
                        </p>
                        <button className="button" onClick={this.onRecenterClick}>
                            Recenter
                        </button>
                        <div style={{overflow: 'auto', maxHeight: 600}}>
                            {listItems}
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

export default MapWrapper;
