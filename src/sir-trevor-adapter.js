(function (factory) {
	var global = window;
	var $ = global.$ || global.jQuery;
	var _ = global._ || global.lodash;

	if (!$) throw new Error('SirTrevorAdapter requires jQuery');
	if (!_) throw new Error('SirTrevorAdapter requires lodash');

	global.SirTrevorAdapter = factory($, _);
} (function($, _) {
	'use strict';

	/**
	 * @typedef {Object} SirTrevorAdapterTemplates
	 * Each key for this template should correspond to a SirTrevorData type. The value can be
	 * a String that will be interpolated via `lodash.template` or a `function (data)` that
	 * recives as first argument the data of the SirTrevorData.
	 */
	var templates = {
		'text': '<%- text %>',
		'quote': '<quote><%- text %></quote>',
		'image': '<div><img src="<%= src %></div>', // Still needs work (Backend implementation)
		'heading': '<h2><%- text %></h2>',
		'list': '<ul><% _.each(listItems, function(e) { %><li><%- e %></li><% }) %></ul>',
		'tweet': '<div></div>', // TODO
		'video': '<div></div>', // TODO
		'button': '<%- text %>',
		'widget': '<%- text %>'
	}

	/**
	 * @typedef {Object} SirTrevorAdapterConfig
	 * @property {String} elementEnclosingTag - Defines the HTML tag to be used arround every SirTrevorData that is serialized by this instance.
	 * @property {String} elementClass - Defines the class to be added to the HTML added arround every SirTrevorData serialized by this instance.
	 * @property {boolean} addElementTypeClass - Determines if a type specific class should be added alongside the `elementClass`.
	 * @property {String} attrName - Defines the attribute name added to the HTML for each SirTrevorData. Note this will be always prepended by `data-`
	 * @property {SirTrevorAdapterTemplates} @see SirTrevorAdapterTemplates
	 */
	var defaultConfig = {
		elementEnclosingTag: 'div',
		elementClass : 'st-render',
		addElementTypeClass : true,
		attrName: 'st',
	}

	/**
	 * @class SirTrevorAdapter
	 * @param {SirTrevorAdapterConfig}
	 * @see SirTrevorAdapterConfig
	 * @see SirTrevorAdapterTemplates
	 */
	var SirTrevorAdapter = function(config) {
		config = config || {};
		this.templates = _.defaults(config.templates || {}, templates);

		delete config.template;
		this.config = _.defaults(defaultConfig, config);
	};

	/**
	 * The minimun representation for a SirTrevor data instance. 
	 * @typedef {Object} SirTrevorData
	 * @property {String} type - The type of this instance
	 * @property {Object} data - The data that represents the object type.
	 */

	/**
	 * @param {Mixed} obj - The object of study
	 * @returns {boolean} `true` if the given obj is a valid `SirTrevorData`; or `false` otherwise
	 * @requires lodash
	 */
	SirTrevorAdapter.prototype._isSirTrevorData = function(obj) {
		return obj && obj.type && obj.data && _.isObject(obj.data);
	};

	/**
     * Finds the HTML template for the type given and compiles it with the data provided.
     * @param {String} type - The type of template you want to render.
     * @param {Object} data - The data to be used as template replacements.
     * @returns {String} The compiled HTML for the combination of arguments given. If a not valid type is given an empty String is returned.
     * @requires lodash
	*/
	SirTrevorAdapter.prototype.renderType = function(type, data) {
		var template = this.templates[type];

		if (!template) {
			console.error('No template for type ' + type);
			return '';
		}

		if (_.isFunction(template))
			return template(data);
		else
			return _.template(template, data);
	}

	/**
     * Given a SirTrevor object this function returns the HTML that will be able to serve as a representation
     * of the given object and also it is an HTML that this library is able to convert back to the original
     * JSON representation
     * @param {Object} obj - An instance of SirTrevor data, this must contain type and data properties.
     * @returns {String} The HTML generated for the given object.
     * @requires jQuery
	 */
	SirTrevorAdapter.prototype.map = function(obj) {
		if (!this._isSirTrevorData(obj)) {
			console.error(JSON.stringify(obj) + ' is not a valid SirTrevor object');
			return '';
		}

		var innerHTML = this.renderType(obj.type, obj.data);
		var classes = [ this.config.elementClass ];
		// If the config is set, also add the element type associated class
		if (this.config.addElementTypeClass)
			classes.push (this.config.elementClass + '-' + obj.type);

		var container = $('<' + this.config.elementEnclosingTag + '>', { class: classes.join(' ') });
		container.attr('data-' + this.config.attrName, JSON.stringify(obj));
		container.html(innerHTML);
		return container[0].outerHTML;
	}

	/**
	 * Given a collection (or a single) of SirTrevorData, the function returns an HTML that contains
	 * the rendered view for each element warped arround a single DOM element.
	 * @param {SirTrevorData | [SirTrevorData]} json - The data to be serialized to HTML.
	 * @returns {String} The HTML representation of each element. Also contains enough data for recover the original JSON afterwards.
	 * @requires lodash
	 */
	SirTrevorAdapter.prototype.toHTML = function(json) {
		if (!_.isArray(json))
			json = [ json ];
		var container = $('<' + this.config.elementEnclosingTag + '>', { class: this.config.elementClass + '-container' });
		return '<div class="st-render-container">' + json.map(this.map, this).join('\n') + '</div>';
	}
	SirTrevorAdapter.prototype.fromJSON = SirTrevorAdapter.prototype.toHTML;

	/**
	 * Given an HTML generated by an instance of SirTrevorAdapter, this function returns the original JSON
	 * used to generate the given HTML.
	 * @param {String} html - The HTML to be parsed.
	 * @returns {[SirTrevorData]} The collection of SirTrevor Data recovered from the HTML.
	 */
	SirTrevorAdapter.prototype.toJSON = function(html) {
		var self = this;
		var doms = $(html);
		var $doms = $(doms);
		var result = [];
		$doms.find('.st-render').each(function (i, obj) {
			result.push($(obj).data(self.config.attrName));
		});
		return result;
	}
	SirTrevorAdapter.prototype.fromHTML = SirTrevorAdapter.prototype.toJSON;

	return SirTrevorAdapter;
}))