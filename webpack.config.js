var webpack = require('webpack')
module.exports = function(isProd) {
    return {
        entry: {
            'sir-trevor-adapter': './src/index.js',
        },
        resolve: {
            alias: {
                cheerio: 'jquery/src/core'
            }
        },
        output: {
            library: 'SirTrevorAdapter',
            filename: '[name].' + (isProd ? 'min.' : '') + 'js'
        },
        plugins: isProd ? [ new webpack.optimize.UglifyJsPlugin() ] : [],
    }
}