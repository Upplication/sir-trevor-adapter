// Browser mocking
Object.assign = require('extend');
global._ = require('lodash');
global.$ = require('cheerio').load('');
global.jQuery = $;
global.SirTrevorAdapter = require('../src/index');
global.sta = SirTrevorAdapter();

require('./index.js');