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
            columns: [
                {
                    blocks: blocks.map(pick)
                },
                {
                    blocks: blocksReversed.map(pick)
                }
            ]
        },
        html:   '<div class="st-column">'
              +     blocks.map(function(block) {
                        return    '<div class="st-row" data-st-type="' + block.type + '">'
                                +     block.html
                                + '</div>';
                    }).join('') 
              + '</div>'
              + '<div class="st-column">'
              +     blocksReversed.map(function(block) {
                        return    '<div class="st-row" data-st-type="' + block.type + '">'
                                +     block.html
                                + '</div>';
                    }).join('') 
              + '</div>'
    }
]
