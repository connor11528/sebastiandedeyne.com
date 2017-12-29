const path = require('path');
const glob = require('glob-all');
const ManifestPlugin = require('webpack-manifest-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const inProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        'css/site': './resources/assets/css/site.css',
        'js/site': './resources/assets/js/site.js',
    },
    output: {
        path: __dirname + '/public',
        filename: '[name]-[hash].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader']),
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.css'],
    },
    plugins: [
        new ExtractTextPlugin('[name]-[hash].css'),
        new ManifestPlugin({
            fileName: 'mix-manifest.json',
            basePath: '/',
        }),
    ],
};

if (inProduction) {
    module.exports.plugins.push(new PurgecssPlugin({
        paths: glob.sync([
            path.join(__dirname, 'app/**/*.php'),
            path.join(__dirname, 'resources/views/**/*.blade.php'),
        ]),
        whitelistPatterns: [
            /turbolinks-/,
        ],
        extractors: [
            {
                extractor: class {
                    static extract(content) {
                        return content.match(/[A-z0-9-:\/]+/g) || [];
                    }
                },
                extensions: ['html', 'js', 'php'],
            },
        ],
    }));
}
