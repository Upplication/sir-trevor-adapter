var $ = require('jquery');
var _template = require('lodash.template');

var MapAdapter = {
    name: 'MapAdapter',

    handles : [
        'map'
    ],

    toHTML: function(data) {
        var img_src = _template("https://maps.googleapis.com/maps/api/staticmap?size=<%= width %>x<%= height %>&center=<%= address %>&markers=|<%= address %>&zoom=<%= zoom %>&scale=2", data);
        var map_ref = _template("http://maps.google.com/maps?q=<%= address %>", data);
        var template = '<a href="<%= map_ref %>"><img src="<%= img_src %>" /></a>';
        return _template(template, { img_src: img_src, map_ref: map_ref });
    },

    toJSON: function(html) {
        var src = $(html).find('img').attr('src');
        var rgx = /center=(.*?)&.*zoom=([0-9]+)&.*scale=([0-9]+)/;
        var match = rgx.exec(html);

        if (!match)
            return {};

        return {
            address: match[1],
            zoom: match[2],
            scale: match[3]
        };
    }
}

module.exports = MapAdapter;