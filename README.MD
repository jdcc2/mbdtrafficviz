#Managing Big Data Traffic Jam Visulation

##Running the app in development mode


##Tools

###Open Map Tiles

Provides maps in vector tile format and map styles to style the vector tiles

- https://openmaptiles.org/ -> vector tile data and map styles

###OSM Bright
Style file used
- https://github.com/openmaptiles/osm-bright-gl-style

###tile-server-gl-light

Serves vector tiles using the slippy URL format.

- https://github.com/klokantech/tileserver-gl

###react-mapbox-gl

React wrapper for mapbox-gl.js, a WebGL powered map rendering engine. Can use, among other sources, vector tile data and GeoJSON

- https://github.com/alex3165/react-mapbox-gl/blob/master/example/src/all-shapes.js

###Other

- https://github.com/mapbox/sphericalmercator -> lat, long(WD84) to spherical mercator coordinates (used in vector tile slippy URL format)
- http://turfjs.org/index.html # GeoJSON manipulation and extraction library
- http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/
- https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers -> section 'Derivation of tile names'