import axios from 'axios';

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

const tileserver = 'http://localhost:8070/data/openmaptiles';

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