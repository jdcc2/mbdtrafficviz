import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
//https://mikewilliamson.wordpress.com/2016/02/24/using-mapbox-gl-and-webpack-together/
import OSMStyle from '../mapstyles/osmbright_style.js'
import {getGeoJSON, closestRoad, roadSegment, lineToPolygon} from '../helpers.js'
import sampledata from '../sampledata.json'
import moment from 'moment'


class MapWrapper extends Component {

    constructor() {
        super();
    }


    render() {

    }
}
