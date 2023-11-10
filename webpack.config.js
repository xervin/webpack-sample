const path = require('path');
const miniCss = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Svgo configuration here https://github.com/svg/svgo#configuration
const svgoOptions = {
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: {
                    removeViewBox: false,
                    addAttributesToSVGElement: {
                        params: {
                            attributes: [
                                {xmlns: "http://www.w3.org/2000/svg"},
                            ],
                        },
                    },
                },
            },
        },
    ],
};

module.exports = {
    entry: {
        'main': [
            './src/js/index.js',
            './src/scss/index.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts.js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    miniCss.loader,
                    {
                        loader : 'css-loader',
                        options: { url : false }
                    },
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|webp)$/i,
                type: 'asset/src/images',
            },
        ],
    },
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            ["svgo", svgoOptions],
                        ],
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/images/'),
                to: path.resolve(__dirname, 'dist/images')
            }]
        }),
        new miniCss({
            filename: 'style.css'
        }),
        new ImageminWebpWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Sample App',
            filename: 'index.html'
        })
    ],
    mode: 'development'
};