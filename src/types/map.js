MapAdapter = {

    handles : [
        'map'
    ],

    toHTML: function(data) {
        var img_src = _.template("https://maps.googleapis.com/maps/api/staticmap?size=<%= width %>x<%= height %>&center=<%= address %>&markers=|<%= address %>&zoom=<%= zoom %>&scale=2", data);
        var map_ref = _.template("http://maps.google.com/maps?q=<%= address %>", data);
        var template = '<a href="<%= map_ref %>"><img src="<%= img_src %>" /></a>';
        return _.template(template, { img_src: img_src, map_ref: map_ref });
    },

    toJSON: function(html) {
        var rgx = /<img src="https:\/\/maps.googleapis.com\/maps\/api\/staticmap?size=600x300&center=(.*?)&markers=|.*?&zoom=([0-9]+)&scale=([0-9]+)"/;
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