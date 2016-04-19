var _ = require('lodash');
var images = require('./image');
var text = require('./text');

var blocks = images.concat(text);
var blocksReversed = blocks.slice().reverse();

var pick = function(obj) {
    return _.pick(obj, [ 'data', 'type' ]);
}

module.exports = [
    {
        type: 'columns',
        data: {
            preset: 'columns-6-6',
            columns: [
                {
                    width: 6,
                    blocks: blocks.map(pick)
                },
                {
                    width: 6,
                    blocks: blocksReversed.map(pick)
                }
            ]
        },
        html:   '<div class="st-column" data-st-column-width="6">'
              +     blocks.map(function(block) {
                        return    '<div class="st-row" data-st-type="' + block.type + '">'
                                +     block.html
                                + '</div>';
                    }).join('') 
              + '</div>'
              + '<div class="st-column" data-st-column-width="6">'
              +     blocksReversed.map(function(block) {
                        return    '<div class="st-row" data-st-type="' + block.type + '">'
                                +     block.html
                                + '</div>';
                    }).join('') 
              + '</div>'
    }
]
