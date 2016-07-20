var SpacerAdapter = {
    name: 'SpacerAdapter',

    handles : [
        'spacer'
    ],

    toHTML: function(data) {
        return _.template('<div style="margin:<%= height %><%= units %> 0;"></div', data);
    },

    toJSON: function(html) {

        var rgx = /margin:\s*([0-9\.]+)([a-z%]+)\s*0/;
        var match = rgx.exec(html);

        if (!match)
            return {};

        return {
            height: Number(match[1].trim()),
            units: match[2].trim()
        };
    }
}

module.exports = SpacerAdapter;