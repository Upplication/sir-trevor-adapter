var $ = require('jquery');
var SirTrevorAdapter = require('../adapter.js');

var ColumnsAdapter = {
    name: 'ColumnsAdapter',

    handles : [
        'columns'
    ],

    _getAdapter: function() {
        if (!this._adapter) {
            this._adapter = SirTrevorAdapter({
                elementClass : 'st-row',
                containerClass: 'st-column'
            })
        }
        
        return this._adapter;
    },

    toHTML: function(data) {
        var adapter = this._getAdapter();
        var $container = $('<div>');

        data.columns.map(function(column) {
            var columnHtml = adapter.toHTML(column.blocks);
            var $column = $(columnHtml);
            $container.append($column);
        });

        return $container.html();
    },

    toJSON: function(html) {
        var adapter = this._getAdapter();
        var $container = $('<div>' + html + '</div>');
        var result = {
            columns: [],
        };

        $container.find('.' + adapter.config.containerClass)
        .each(function(i, column) {

            var $container = $('<div>');
            var $column = $(column);
            $container.append($column)

            var stColumn = {
                blocks: adapter.toJSON($container.html()),
            };

            result.columns.push(stColumn);
        });

        return result;
    }
}

module.exports = ColumnsAdapter;