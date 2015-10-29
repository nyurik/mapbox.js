'use strict';

var request = require('./request'),
    format_url = require('./format_url'),
    util = require('./util');

module.exports = {
    _loadTileJSON: function(_) {
        if (typeof _ === 'string') {

            if (_.indexOf('mapbox://') > -1) {
                var styleURL = format_url.style(_, this.options && this.options.accessToken);

                request(styleURL, L.bind(function(err, style) {
                    if (err) {
                        util.log('could not load Mapbox style at ' + styleURL);
                        this.fire('error', {error: err});
                    }

                    var sources = [];
                    console.log(style);
                    console.log(err);
                    for (var id in style.sources) {
                        var source = style.sources[id].url.split('mapbox://')[1];
                        sources.push(source);
                    }
                    request(format_url.tileJSON(sources.join(), this.options.accessToken), L.bind(function(err, json) {
                        if (err) {
                            util.log('could not load TileJSON at ' + _);
                            this.fire('error', {error: err});
                        } else if (json) {
                            this._setTileJSON(json);
                            this.fire('ready');
                        }
                    }, this));

                }, this));

            } else {
                _ = format_url.tileJSON(_, this.options && this.options.accessToken);
                request(_, L.bind(function(err, json) {
                    if (err) {
                        util.log('could not load TileJSON at ' + _);
                        this.fire('error', {error: err});
                    } else if (json) {
                        this._setTileJSON(json);
                        this.fire('ready');
                    }
                }, this));
            }
        } else if (_ && typeof _ === 'object') {
            this._setTileJSON(_);
        }
    }
};
