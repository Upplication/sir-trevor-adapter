'use strict'

var SirTrevorAdapter = require('./adapter.js');
SirTrevorAdapter.ButtonAdapter = require('./types/button.js');
SirTrevorAdapter.ImageAdapter = require('./types/image.js');
SirTrevorAdapter.ListAdapter = require('./types/list.js');
SirTrevorAdapter.MapAdapter = require('./types/map.js');
SirTrevorAdapter.SpacerAdapter = require('./types/spacer.js');
SirTrevorAdapter.TextAdapter = require('./types/text.js');
SirTrevorAdapter.VideoAdapter = require('./types/video.js');
SirTrevorAdapter.ColumnsAdapter = require('./types/columns.js');

module.exports = SirTrevorAdapter;