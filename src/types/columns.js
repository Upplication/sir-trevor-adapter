var SirTrevorAdapter = require('../adapter.js');

ColumnsAdapter = {
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
            $column.attr('data-' + adapter.config.containerClass + '-width', column.width);
            $container.append($column);
        });

        return $container.html();
    },

    toJSON: function(html) {
        var adapter = this._getAdapter();
        var $container = $('<div>' + html + '</div>');
        var result = {
            columns: [],
            preset: 'columns-'
        };

        $container.find('.' + adapter.config.containerClass)
        .each(function(i, column) {

            var $container = $('<div>');
            var $column = $(column);
            $container.append($column)

            var stColumn = {
                blocks: adapter.toJSON($container.html()),
                width: $column.data(adapter.config.containerClass + '-width')
            };

            result.columns.push(stColumn);
        });

        result.preset += result.columns
        .map(function(column) {
            return column.width;
        })
        .join('-');

        return result;
    }
}

module.exports = ColumnsAdapter;