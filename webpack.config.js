const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // installed via npm
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/boot.ts',
    },
    output: {
        filename: '[name].bundle.[hash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: "[id].[hash].chunk.js"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        // new webpack.BannerPlugin('版权所有，翻版必究'),  // new一个插件的实例
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new CleanWebpackPlugin(),  // 所要清理的文件夹名称 ---cleanConfig
        new MiniCssExtractPlugin(
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            {
                filename: '[name].css',
                // chunkFilename: '[id].css',
            }
        ),
        new webpack.SourceMapDevToolPlugin({}),
        new FilterWarningsPlugin({
            exclude: /Critical dependency: the request of a dependency is an expression/
        }),
        // new webpack.HotModuleReplacementPlugin() // 热更新插件
        new BundleAnalyzerPlugin()//打包完后展示分析数据

    ],
    optimization: {
        // minimize: false,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
//             chunks： 该属性值的数据类型可以是 字符串 或者 函数。如果是字符串，那它的值可能为 initial | async | all 三者之一。默认值的数据类型为 字符串，默认值为 async，但推荐用 all。它表示将哪种类型的模块分离成新文件。字符串参数值的作用分别如下：
// initial：表示对异步引入的模块不处理
// async：表示只处理异步模块
// all：无论同步还是异步，都会处理
// minSize： 该属性值的数据类型为数字。它表示将引用模块分离成新代码文件的最小体积，默认为 30000，单位为字节，即 30K（指min+gzip之前的体积）。这里的 30K 应该是最佳实践，因为如果引用模块小于 30K 就分离成一个新代码文件，那页面打开时，势必会多增加一个请求。
// maxSize： 该属性值的数据类型为数字。它表示？
// minChunks： 该属性值的数据类型为数字。它表示将引用模块如不同文件引用了多少次，才能分离生成新代码文件。默认值为 1
// maxAsyncRequests： 该属性值的数据类型为数字，默认值为 5。它表示按需加载最大的并行请求数，针对异步。
// maxInitialRequests： 该属性值的数据类型为数字，默认值为 3。它表示单个入口文件最大的并行请求数，针对同步。
// automaticNameDelimiter： 该属性值的数据类型为字符串，默认值为 ~。它表示分离后生成新代码文件名称的链接符，比如说 app1.js 和 app2.js 都引用了 utils.js 这个工具库，那么，最后打包后分离生成的公用文件名可能是 xx~app1~app2.js 这样的，即以 ~ 符号连接。
// name： 该属性值的数据类型可以是 布尔值 或者 函数（返回值为字符串），其中布尔值得为 true，此时，分离文件后生成的文件名将基于 cacheGroups 和 automaticNameDelimiter。如果设置为 false，则不会进行模块分离。
// cacheGroups： 该属性值的数据类型为对象，它的值可以继承 splitChunks.* 中的内容。如果 cacheGroups存在与 splitChunks.* 同名的属性，则 cacheGroups 的属性值则直接覆盖 splitChunks.* 中设置的值。
// test： 该属性值的数据类型可以为 字符串 或 正则表达式，它规定了哪些文件目录的模块可以被分离生成新文件。
// priority： 该属性值的数据类型可以为数字，默认值为 0。它表示打包分离文件的优先级。
// reuseExistingChunk： 该属性值的数据类型可以为布尔值。它表示针对已经分离的模块，不再重新分离。
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                // styles: {
                //     name: 'styles',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true,
                // },
            }
        }
    },
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader'
            //     ]
            // },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /[\/\\]@angular[\/\\].+\.js$/, parser: {system: true}
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true, // its for live reload issue resolved
        compress: true,
        port: '4203',
        historyApiFallback: true
        // hot: true // 热更新
    },
    devtool: 'source-map',
};

