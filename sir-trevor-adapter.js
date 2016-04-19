var SirTrevorAdapter =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	            __webpack_require__(1),
	            __webpack_require__(2),
	            __webpack_require__(3),
	            __webpack_require__(4),
	            __webpack_require__(5),
	            __webpack_require__(6),
	            __webpack_require__(7),
	            __webpack_require__(8),
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

	SirTrevorAdapter.ButtonAdapter = __webpack_require__(1);
	SirTrevorAdapter.ImageAdapter = __webpack_require__(3);
	SirTrevorAdapter.ListAdapter = __webpack_require__(4);
	SirTrevorAdapter.MapAdapter = __webpack_require__(5);
	SirTrevorAdapter.SpacerAdapter = __webpack_require__(6);
	SirTrevorAdapter.TextAdapter = __webpack_require__(7);
	SirTrevorAdapter.VideoAdapter = __webpack_require__(8);
	SirTrevorAdapter.ColumnsAdapter = __webpack_require__(2);

	module.exports = SirTrevorAdapter;

/***/ },
/* 1 */
/***/ function(module, exports) {

	ButtonAdapter = {
		name: 'ButtonAdapter',

		handles : [
			'button'
		],

		toHTML: function(data) {
			var $div = $('<div>');
			var $a = $('<a>').appendTo($div);
			/*var $clear = */$('<div>', { style: 'clear: both' }).appendTo($div);
			$a.html(data.text);
			if (data.href && data.href.length > 0)
				$a.attr('href', data.href);
			$a.attr('data-st-user-href', data['user-href']);
			// we dont use $a.css('style') because css method use computed style and could change all the style attr of the elem.
			$a.attr('style', 'overflow: hidden; display: block; line-height: normal; box-sizing: border-box; border-style: solid; text-align: center; margin: 0 auto;');
			$a.find('> *').css('margin', '0');

			Object.keys(data).forEach(function(e) {
				if (!/^css\-/.test(e))
					return;
				var cssKey = e.replace(/^css-/, '');
				var cssVal = data[e];
				$a.attr('style', $a.attr('style') + cssKey + ':' + cssVal + ';');
			});

			return $div.html();
		},

		toJSON: function(html) {
			var $a = $(html);

			var data = {};
			data.format = 'html';
			data.text = $a.html();
			data.href = $a.attr('href');
			data['user-href'] = $a.attr('data-st-user-href');
			$a.attr('style').split(';')
				.filter(function(elem) {
					return elem.indexOf(':') != -1
				})
				.forEach(function (e) {
					var v = e.split(':');
					var cssAttr = v[0].replace(/\s/g, '');
					var cssVal = v[1].trim();
					data['css-' + cssAttr] = cssVal;
				});

			return data;
		}
	}

	module.exports = ButtonAdapter;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	ColumnsAdapter = {
	    name: 'ColumnsAdapter',

	    handles : [
	        'columns'
	    ],

	    _getAdapter: function() {
	        if (!this._adapter) {
	            var SirTrevorAdapter = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../index\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	ImageAdapter = {
		name: 'ImageAdapter',

		handles : [
			'image',
			'image_edit'
		],

		toHTML: function(data) {
			if (!data || !data.file)
				return  '';

			var file = data.file.url || '';
			var href = data.href;

			var result = '<img src="' + file + '"/>';

			if (href && href.length > 0)
				return '<a href="' + href + '">' + result + '</a>';

			return result;
		},

		toJSON: function(html) {
			var file = '';
			var rgxImg = /<img src="(.*?)"\/?>/;
			var matchImg = rgxImg.exec(html);
			if (matchImg)
				file = matchImg[1];

			var href = null;
			var rgxHref = /<a href="(.*?)">/;
			var matchHref = rgxHref.exec(html);
			if (matchHref)
				href = matchHref[1];

			return { 
				href: href,
				file: { url: file }
			};
		}
	}

	module.exports = ImageAdapter;

/***/ },
/* 4 */
/***/ function(module, exports) {

	ListAdapter = {
		name: 'ListAdapter',

		handles : [
			'list'
		],

		toHTML: function(data) {
			return data.listItems.reduce(function (v, c) {
				v += '<li>' + c.content + '</li>';
			}, '<ul>') + '</ul>';
		},
		
		toJSON: function(html) {
			var rgx = /<li>(.*)<\/li>/;
			var listItems = [];
			var match;

			while ((match = rgx.exec(html)) !== null)
				listItems.push({ content: match[1] });

			return { listItems: listItems };
		}
	}

	module.exports = ListAdapter;

/***/ },
/* 5 */
/***/ function(module, exports) {

	MapAdapter = {
	    name: 'MapAdapter',

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	SpacerAdapter = {
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	TextAdapter = {
		name: 'TextAdapter',

		handles : [
			'text',
			'heading',
			'ck_editor',
			'quote',
			'widget'
		],

		tags : { // Relates the st type with the html tag for serializing/deserializing
			'heading' : 'h2',
			'quote': 'quote'
		},

		toHTML: function(data, type) {
			if (data.format == 'html') {
				var content = data.text;
				var tag = this.tags[type];

				if (tag)
					content = '<' + tag + '>' + content + '</' + tag + '>';

				return content;
			} else {
				console.error('Invalid type ' + data.format + ' for block type ' + type);
				return '';
			}
		},
		
		toJSON: function(html, type) {
			var tag = this.tags[type];

			if (tag)
				html = html
						.replace(new RegExp('^<' + tag + '>'), '')
						.replace(new RegExp('</' + tag + '>$'), '');

			return { text: html, format: 'html' };
		}
	}

	module.exports = TextAdapter;

/***/ },
/* 8 */
/***/ function(module, exports) {

	VideoAdapter = {
	    name: 'VideoAdapter',

	    handles : [
	        'video'
	    ],

	    // more providers at https://gist.github.com/jeffling/a9629ae28e076785a14f
	    providers: {
	        vimeo: {
	            regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+(?:\/)([^\/].*)+$)/,
	            html: "<iframe src=\"<%= protocol %>//player.vimeo.com/video/<%= remote_id %>?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
	        },
	        youtube: {
	            regex: /^.*(?:(?:youtu\.be\/)|(?:youtube\.com)\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)/,
	            html: "<iframe src=\"<%= protocol %>//www.youtube.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
	        },
	        vine: {
	            regex: /(?:http[s]?:\/\/)?(?:www.)?vine.co\/v\/([^\W]*)/,
	            html: "<iframe class=\"vine-embed\" src=\"<%= protocol %>//vine.co/v/<%= remote_id %>/embed/simple\" width=\"<%= width %>\" height=\"<%= width %>\" frameborder=\"0\"></iframe><script async src=\"http://platform.vine.co/static/scripts/embed.js\" charset=\"utf-8\"></script>",
	            square: true
	        },
	        dailymotion: {
	            regex: /(?:http[s]?:\/\/)?(?:www.)?dai(?:.ly|lymotion.com\/video)\/([^\W_]*)/,
	            html: "<iframe src=\"<%= protocol %>//www.dailymotion.com/embed/video/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
	        }
	    },

	    toHTML: function(data) {

	        if (!this.providers.hasOwnProperty(data.source))
	            return "";

	        var source = this.providers[data.source];

	        var protocol = window.location.protocol === "file:" ? 
	          "http:" : window.location.protocol;

	        return _.template(source.html, {
	            protocol: protocol,
	            remote_id: data.remote_id
	        });
	    },

	    toJSON: function(html) {
	        var matchUrl = /<iframe src="(.*?)"/.exec(html);

	        if (!(matchUrl && matchUrl[1]))
	            return {};

	        var url = matchUrl[1];
	        var self = this;
	        return Object.keys(this.providers).reduce(function (result, providerKey) {
	            if (!_.isEmpty(result))
	                return result;

	            var provider = self.providers[providerKey];
	            var match = provider.regex.exec(url);

	            if (match && match[1]) {
	                return {
	                    source: providerKey,
	                    remote_id: match[1]
	                }
	            } else
	                return result;
	        }, {});
	    },
	}

	module.exports = VideoAdapter;

/***/ }
/******/ ]);