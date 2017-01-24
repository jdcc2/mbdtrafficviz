import axios from 'axios';
import turf from 'turf'

/**
 * Convert the longitude and latitude coordinates together with the zoom level to XYZ tiles (slippy url format)
 *
 * This requires converting the longitude and latitude to Spherical Mercator xy coordinates first
 * and then calculating the tile to query based on the zoom level.
 *
 * Basically Google's tile format, which is TMS with a different origin
 *
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers
 *
 * @param {Number} lon - longitude
 * @param {Number} lat - latitude
 * @param {Number} zoom - zoom level (0-14)
 * @returns {*[]}
 */
export function llToTile(lon, lat, zoom) {
    let x = Math.floor((lon+180)/360*Math.pow(2,zoom));
    let y = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
    return [x, y, zoom]
}

/**
 * Search the GeoJSON feature collection for major road closest to given lon, lat coordinates
 *
 * Returns null when no closest road could not be found or an object in the following form:
 *
 * {line: <LineString GeoJSON object representing the closest major road>,
 *  distance: <distance in km>,
 *  lineLocation: <distance along the line (currently not working)>
 * }
 *
 * @param data - GeoJSON feature collection
 * @param lon
 * @parm lat
 */
export function closestRoad(data, lon, lat) {
    //roads are in the layer transportation and classes are motorway, trunk, primary, secondary, tertiary
    //use motorway, trunk, primary (A en N roads)
    let reference = turf.point([lon, lat]);

    let closestPoints = [];
    //Find all mayor roads
    data.features.forEach((feature) => {
        if(feature.geometry.type === 'LineString'
            && feature.properties.layer === 'transportation'
            && (feature.properties.class === 'primary' || feature.properties.class === 'motorway' || feature.properties.class === 'trunk')) {
            //calculate closest point in each line to reference point
            closestPoints.push({road: feature, point: turf.pointOnLine(feature, reference)});
        }
    });
    //find the the road with the closest point to the reference point
    let resultCombo = null;
    closestPoints.forEach((combo) => {
        if(!resultCombo) {
            resultCombo = combo;
        } else if(combo.point.properties.dist < resultCombo.point.properties.dist) {
            resultCombo = combo
        }
    });

    //Convert output to array
    let result = null;
    if(resultCombo) {
        result = { line: resultCombo.road, distance: resultCombo.point.properties.dist, lineLocation: resultCombo.point.properties.location};
    }

    return result;

}

const tileserver = 'http://localhost:8070/data/v3';

/**
 * Get GeoJSON data for the given coordinates
 *
 * @param lon
 * @param lat
 * @param zoom
 * @returns {*}
 */
export function getGeoJSON(lon, lat, zoom) {
    let [x,y,z] = llToTile(lon, lat, zoom);
    console.log(x);
    console.log(y);
    console.log(z);
    let config = {
        method: 'get',
        url: `${tileserver}/${z}/${x}/${y}.geojson`
    };

    return axios(config).then((response) => {
        return response.data;
    });
}