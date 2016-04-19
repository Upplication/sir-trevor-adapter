'use strict'

/**
 * @typedef {Object} SirTrevorAdapterConfig
 * @property {String} elementEnclosingTag - Defines the HTML tag to be used arround every SirTrevorData that is serialized by this instance.
 * @property {String} elementClass - Defines the class to be added to the HTML added arround every SirTrevorData serialized by this instance.
 * @property {boolean} addElementTypeClass - Determines if a type specific class should be added alongside the `elementClass`.
 * @property {String} attrName - Defines the attribute name added to the HTML for each SirTrevorData. Note this will be always prepended by `data-`
 */
var defaultConfig = {
    elementEnclosingTag: 'div',
    elementClass : 'st-render',
    addElementTypeClass : true,
    containerClass: 'st-render-container',
    attrName: 'st',
    attrType: 'st-type'
}

var SirTrevorAdapter = function(userConfig, adapters) {

    var adapter = {
        config: Object.assign({}, defaultConfig, userConfig || {}),
        adapters: adapters || [
            require('./types/button.js'),
            require('./types/columns.js'),
            require('./types/image.js'),
            require('./types/list.js'),
            require('./types/map.js'),
            require('./types/spacer.js'),
            require('./types/text.js'),
            require('./types/video.js'),
        ],

        /**
         * @private
         * Initializes the adapter and its associated type adapters.
         */
        initialize: function() {
            var self = this;
            this.adapters.forEach(function(typeAdapter) {
                if (typeAdapter.initialize instanceof Function)
                    typeAdapter.initialize(self);
            })
            return self;
        },

        /**
         * @private
         * @param {Mixed} obj - The object of study
         * @returns {boolean} {true} if the given obj is a valid {SirTrevorData}; or {false} otherwise
         * @requires lodash
         * @memberof SirTrevorAdapter
         */
        isSirTrevorData: function(obj) {
            return !!(obj && obj.type && obj.data && _.isObject(obj.data) && _.isString(obj.type));
        },

        /**
         * Given a data (or a data type) returns the first handler that can handle the 
         * specified type. If no adapter is found, returns null.
         * @param {SirTrevorData | String} data - An instance of sir trevor data (containing a type field) or a type name itself.
         * @returns {SirTrevorTypeAdapter} The adapter that can handle the given type (or null)
         */
        getAdapterFor: function(data) {

            if (!data)
                return null;

            var type = data.type || data;
            return this.adapters.reduce(function(adapter, current) {
                if (adapter)
                    return adapter;

                if (current.handles.indexOf(type) >= 0)
                    return current;
                else
                    return null;
            }, null);
        },

        /**
         * Given a collection (or a single) instance of SirTrevorData, the function returns an HTML that contains
         * the rendered view for each element warped arround a single DOM element.
         * @param {SirTrevorData | SirTrevorData[]} json - The data to be serialized to HTML.
         * @returns {String} The HTML representation of each element. Also contains enough data for recover the original JSON afterwards.
         * @memberof SirTrevorAdapter
         * @requires lodash
         */
        toHTML: function(data) {
            var wasArray = true;
            if (!_.isArray(data)) {
                data = [ data ];
                wasArray = false;
            }

            var self = this;

            // This is an inner function that maps each ST data insatnce ( {data:..., type:...} ) to html
            var mapper = function (dataInstance) {

                if (!self.isSirTrevorData(dataInstance))
                    throw Error('No valid SirTrevorData ' + dataInstance);

                var handler = self.getAdapterFor(dataInstance);
                if (!handler)
                    throw Error('No handler for ' + dataInstance.type);

                // -- No errors so far, start building the container

                var dummyDiv = $('<div>');
                var container = $('<' + self.config.elementEnclosingTag + '>');

                container.addClass(self.config.elementClass);
                if (self.config.addElementTypeClass) // If the config is set, also add the element type associated class
                    container.addClass(self.config.elementClass + '-' + dataInstance.type);

                container.html(handler.toHTML(dataInstance.data, dataInstance.type));
                container.attr('data-' + self.config.attrType, dataInstance.type);

                dummyDiv.append(container);
                return dummyDiv.html();
            };

            var mapped = data.map(mapper);

            if (wasArray)
                return '<div class="' + self.config.containerClass + '">' + mapped.join(' ') + '</div>';
            else
                return mapped.pop();
        },

        /**
         * Given an HTML generated by an instance of SirTrevorAdapter, this function returns the original JSON
         * used to generate the given HTML.
         * @param {String} html - The HTML to be parsed.
         * @memberof SirTrevorAdapter
         * @returns {SirTrevorData[]} The collection of SirTrevor Data recovered from the HTML.
         */
        toJSON: function(html) {
            var self = this;
            var $doms = $(html);

            return $doms.find('.' + this.config.elementClass)
            .map(function (i, obj) {
                var $obj = $(obj);

                // -- Support for 1.0.X Version
                var dataSt = $obj.data(self.config.attrName);
                if (dataSt)
                    return dataSt;
                // -- EOF Support

                var type = $obj.data(self.config.attrType);
                if (!type)
                    throw Error('No data-' + self.config.attrType + ' tag found on: ' + html);

                var handler = self.getAdapterFor(type);
                if (!handler)
                    throw Error('No handler for ' + type);

                return {
                    type: type,
                    data: handler.toJSON($obj.html(), type)
                };
            })
            .get();
        }

    }

    return adapter.initialize();
}

SirTrevorAdapter.ButtonAdapter = require('./types/button.js');
SirTrevorAdapter.ImageAdapter = require('./types/image.js');
SirTrevorAdapter.ListAdapter = require('./types/list.js');
SirTrevorAdapter.MapAdapter = require('./types/map.js');
SirTrevorAdapter.SpacerAdapter = require('./types/spacer.js');
SirTrevorAdapter.TextAdapter = require('./types/text.js');
SirTrevorAdapter.VideoAdapter = require('./types/video.js');
SirTrevorAdapter.ColumnsAdapter = require('./types/columns.js');

module.exports = SirTrevorAdapter;