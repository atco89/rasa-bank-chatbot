// Import necessary modules and plugins.
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const i18n = require('./app/js/utils/i18nSetup');
const TerserPlugin = require("terser-webpack-plugin");

// Define a constant for development mode.
const DEVELOPMENT = 'development';

// Export the webpack configuration as a function.
module.exports = (env, argv) => {
    // Check if the mode is production or development.
    const isProduction = argv.mode === 'production';

    // Determine the appropriate environment configuration path based on the mode.
    const environmentConfigPath = isProduction
        ? './app/js/environments/prod.js'
        : './app/js/environments/dev.js';
    const environmentConfig = require(environmentConfigPath);

    // Define the list of JavaScript modules to compile.
    const entries = {
        'app': './app/app.js',
    };

    // Return the webpack configuration object.
    // noinspection JSUnresolvedReference,JSUnresolvedFunction
    return {
        context: __dirname,
        devtool: 'source-map',

        // Define entry points for different JavaScript modules.
        entry: entries,

        // Define the output configuration.
        output: {
            publicPath: '/',
            path: path.resolve(__dirname, 'public'),
            filename: 'js/[name].js',
        },

        // Set the mode based on the environment.
        mode: process.env.NODE_ENV || DEVELOPMENT,

        // Define module rules for loaders.
        module: {
            rules: [
                // JavaScript loader using Babel.
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },

                // CSS and SASS loaders.
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },

                // Image loader and optimizer.
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    include: path.resolve(__dirname, 'app', 'images'),
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024, // 10KB
                        },
                    },
                    generator: {
                        filename: 'images/[name].[ext]',
                    },
                },
            ],
        },

        // Define optimization settings.
        optimization: {
            minimize: true,

            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        safari10: true,
                        output: {
                            ascii_only: true,
                        },
                    }
                }),

                // Minimize and optimize CSS files.
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: {
                                    removeAll: true,
                                },
                            },
                        ],
                    },
                }),

                // Minimize and optimize images.
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            plugins: [
                                ['imagemin-mozjpeg', {
                                    quality: 40,
                                }],
                                ['imagemin-pngquant', {
                                    quality: [
                                        0.65,
                                        0.90,
                                    ],
                                    speed: 4,
                                }],
                                ['imagemin-gifsicle', {
                                    interlaced: true,
                                }],
                                ['imagemin-svgo', {
                                    plugins: [
                                        {
                                            name: 'preset-default',
                                            params: {
                                                overrides: {
                                                    removeViewBox: false,
                                                    addAttributesToSVGElement: {
                                                        params: {
                                                            attributes: [
                                                                {
                                                                    xmlns: 'http://www.w3.org/2000/svg',
                                                                },
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                }],
                            ],
                        },
                    },
                    loader: false,
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    severityError: 'warning',
                    deleteOriginalAssets: false,
                }),
            ],
        },

        // Define plugins for additional functionality.
        plugins: [
            // Set environment variables for the app.
            new webpack.DefinePlugin({
                'process.env.ENVIRONMENT_CONFIG': JSON.stringify(environmentConfig),
            }),

            // Clean the output directory before generating a new build.
            new CleanWebpackPlugin(),

            // Extract CSS into a separate file.
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),

            // Generate HTML file from template and inject assets.
            new HtmlWebpackPlugin({
                template: 'templates/index.html',
                filename: 'index.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                templateParameters: {
                    t: (key) => i18n.t(key),
                },
            }),

            // Generate HTML file from template and inject assets.
            new HtmlWebpackPlugin({
                template: 'templates/403.html',
                filename: '403.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                templateParameters: {
                    t: (key) => i18n.t(key),
                },
            }),

            // Generate HTML file from template and inject assets.
            new HtmlWebpackPlugin({
                template: 'templates/404.html',
                filename: '404.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                templateParameters: {
                    t: (key) => i18n.t(key),
                },
            }),

            // Generate HTML file from template and inject assets.
            new HtmlWebpackPlugin({
                template: 'templates/405.html',
                filename: '405.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                templateParameters: {
                    t: (key) => i18n.t(key),
                },
            }),

            // Generate HTML file from template and inject assets.
            new HtmlWebpackPlugin({
                template: 'templates/500.html',
                filename: '500.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                templateParameters: {
                    t: (key) => i18n.t(key),
                },
            }),

            // Obfuscate JavaScript files for added security.
            new WebpackObfuscator({
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.2,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.2,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'hexadecimal',
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.8,
                unicodeEscapeSequence: false,
            }),

            // Copy static images to the output directory.
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'app', 'images'),
                        to: path.resolve(__dirname, 'public', 'images'),
                        force: true,
                    },
                ],
            }),

            // Compress JavaScript and CSS files using gzip.
            new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.(js|css)$/,
            }),
        ].filter(Boolean),
    };
};