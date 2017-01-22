/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'
import ReactMapboxGl, { Layer, Feature, ZoomControl, ScaleControl, Marker } from "react-mapbox-gl";
import OSMStyle from '../mapstyles/osmbright_style.js'

let style = OSMStyle;
//Set source to local vector tile server
style.sources = {
    "openmaptiles": {
        "type": "vector",
        "url": "http://localhost:8070/data/openmaptiles.json"
    }
};

let datapoint = {'lane': 'lane2', 'measurementSiteId': 'GEO02_R_RWSTI610', 'measurementTime': '2017-01-20T06:11:00Z', 'period': 60.0, 'longitude': 4.41788, 'nrOfLanes': '2', 'measurementSiteName': 'R_RWS_0610', 'latitude': 52.1431, 'averageFlow': 12.0, 'averageSpeed': 32.0};

/**
 * WARNING: the map component used longitude, latitude format for coordinates :/
 */
class Map extends Component {

    render() {
        return (
            <ReactMapboxGl
                style={style}
                center={[5.175500, 52.078689]}
                zoom={[8]}
                pitch={30}
                //Not needed
                accessToken="pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
                containerStyle={{
                    height: "100vh",
                    width: "100vw"
                }}>
                <Layer
                    type="line"
                    layout={{ "line-cap": "round", "line-join": "round" }}
                    paint={{ "line-color": "#4790E5", "line-width": 12 }}>
                    <Feature coordinates={[[5.175500, 52.078689], [5.2, 52.1]]}/>
                </Layer>
                <Layer
                    type="circle"
                    paint={{ "circle-radius": 30, "circle-color": "#E54E52", "circle-opacity": .8 }}>
                    <Feature coordinates={[5.175500, 52.078689]}/>
                </Layer>
                <Marker
                    coordinates={[5.175500, 52.078689]}>
                    <h1>TEST</h1>
                </Marker>
            </ReactMapboxGl>
        );
    }


}

export default Map;