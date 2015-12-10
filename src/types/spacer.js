SpacerAdapter = {

    handles : [
        'spacer'
    ],

    toHTML: function(data) {
        return _.template('<div style="margin:<%= height %><%= units %> 0;"></div', data);
    },

    toJSON: function(html) {

        var rgx = /margin:([0-9]+)(.*);/;
        var match = rgx.exec(html);

        if (!match)
            return {};

        return {
            height: match[1],
            units: match[2]
        };
    }
}

module.exports = SpacerAdapter;