'use strict';

var util = require('./util');
var format_url = require('./format_url');

var StyleLayer = L.TileLayer.extend({
    includes: [require('./load_tilejson')],

    options: {
        sanitizer: require('sanitize-caja'),
        tileSize: 512,
        zoomOffset: -1
    },

    scalePrefix: '@2x',

    initialize: function(_, options) {
        L.TileLayer.prototype.initialize.call(this, undefined, options);

        this.options.tiles = this._formatTileURL(_);

        this._tilejson = {};

        if (options && options.format) {
            util.strict_oneof(options.format, this.formats);
        }

        this._loadTileJSON(_);
    },

    _setTileJSON: function(json) {
        util.strict(json, 'object');

        L.extend(this.options, {
            attribution: this.options.sanitizer(json.attribution),
            minZoom: json.minzoom || 0,
            maxZoom: json.maxzoom || 18,
            bounds: json.bounds && util.lbounds(json.bounds)
        });

        this._tilejson = json;
        return this;
    },

    // disable the setUrl function, which is not available on mapbox tilelayers
    setUrl: null,

    _formatTileURL: function(styleURL) {
        if (styleURL.indexOf('mapbox://styles/') === -1) {
            util.log('Incorrectly formatted Mapbox style at ' + styleURL);
            this.fire('error');
        }

        var ownerIDStyle = styleURL.split('mapbox://styles/')[1];
        var retina = L.Browser.retina ? '@2x' : '';
        return format_url('/styles/v1/' + ownerIDStyle + '/tiles/{z}/{x}/{y}' + retina, this.options.accessToken);
    },

    // this is an exception to mapbox.js naming rules because it's called
    // by `L.map`
    getTileUrl: function(tilePoint) {
        var templated = L.Util.template(this.options.tiles, tilePoint);
        if (!templated) {
            return templated;
        } else {
            return templated;
        }
    },

    // TileJSON.TileLayers are added to the map immediately, so that they get
    // the desired z-index, but do not update until the TileJSON has been loaded.
    _update: function() {
        if (this.options.tiles) {
            L.TileLayer.prototype._update.call(this);
        }
    }
});

module.exports.StyleLayer = StyleLayer;

module.exports.styleLayer = function(_, options) {
    return new StyleLayer(_, options);
};
