const path = require('path');

const git = require('git-revision');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const args = require('node-args');

const port = process.env.npm_package_config_port;
const target = `${__dirname}/dist`;

const ROOT_PATH = require('path').resolve(__dirname);

const mode = args.mode;
const isExternals = args.externals !== false;
const isAnalyzer = args.analyzer;

let config = {
    mode: mode,
    entry: {},
    stats: isAnalyzer ? 'normal' : 'errors-warnings',
    output: {
        path: target,
        filename: '[name].[hash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src'),
                ],
            },
            {
                test: /\.css/,
                loader: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.less/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            plugins: [
                                new LessPluginAutoPrefix({
                                    browsers: ['ie >= 9', 'last 1 version'],
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(png|gif|jpg|svg|woff)$/,
                loader: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest',
        },
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js[x]?/,
                },
                styles: {
                    name: 'styles',
                    test: /\.(less|css)$/,
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        },
    },
    resolve: {
        alias: require('./webpack.alias.js'),
        extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [
        new CleanWebpackPlugin([target]),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[hash:8].css",
            chunkFilename: "[id].[hash:8].css"
        }),
        new ForkTsCheckerWebpackPlugin({
            // 将async设为false，可以阻止Webpack的emit以等待类型检查器/linter，并向Webpack的编译添加错误。
            async: false,
        }),
        // 将TypeScript类型检查错误以弹框提示
        // 如果fork-ts-checker-webpack-plugin的async为false时可以不用
        // 否则建议使用，以方便发现错误
        new ForkTsCheckerNotifierWebpackPlugin({
            title: 'TypeScript',
            excludeWarnings: true,
            skipSuccessful: true,
        }),
    ],
    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0',
        port,
        useLocalIp: true,
        disableHostCheck: true,
        openPage: 'app',
        proxy: {
            '/api/*': {
                target: `http://localhost:${Number(port) + 1}`,
            },
            '/app': { target: `http://localhost:${port}`, pathRewrite: { '$': '.html' } },
        },
        lazy: false,
        compress: true, //启用gzip压缩
        headers: {
            'X-Frame-Options': 'SAMEORIGIN',
            'X-XSS-Protection': '1; mode=block',
        },
        disableHostCheck: true,
    },
};

function addEntries() {
    let pages = require('./pages.js');
    pages.forEach(function (page) {
        config.entry[page.name] = [`${ROOT_PATH}/src/${page.name}.tsx`];
        let plugin = new HtmlWebpackPlugin({
            filename: `${page.name}.html`,
            template: `${ROOT_PATH}/template.ejs`,
            chunks: ['manifest', 'vendor', page.name],
            favicon: `src/favicon.ico`,
            name: page.name,
            title: page.title,
            banner: {
                tag: git('tag'),
                date: new Date().toLocaleString(),
                branch: git('branch'),
            },
            IS_EXTERNALS: isExternals,
        });
        config.plugins.push(plugin);
    });
}
addEntries();

module.exports = config;
