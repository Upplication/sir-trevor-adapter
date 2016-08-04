var webpack = require('webpack')
var generate = function(isProd) {
    return {
        entry: {
            'sir-trevor-adapter': './src/index.js',
        },
        output: {
            library: 'SirTrevorAdapter',
            filename: '[name].' + (isProd ? 'min.' : '') + 'js'
        },
        plugins: isProd ? [ new webpack.optimize.UglifyJsPlugin() ] : [],
    }
}

module.exports = generate(false)
module.exports.generate = generate