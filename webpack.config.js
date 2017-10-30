var webpack = require('webpack')
var generate = function(isProd) {
    return {
        entry: {
            'sir-trevor-adapter': './src/index.js',
        },
        output: {
            library: 'SirTrevorAdapter',
            libraryTarget: 'umd',
            filename: '[name].' + (isProd ? 'min.' : '') + 'js'
        },
        plugins: isProd ? [ new webpack.optimize.UglifyJsPlugin() ] : [],
        externals: {
            jquery: {
                commonjs: 'jquery',
                amd: 'jquery',
                root: 'jQuery'
            }
        }
    }
}

module.exports = generate(false)
module.exports.generate = generate