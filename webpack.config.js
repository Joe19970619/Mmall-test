/**
 * Created by Gakki on 2017/9/22.
 */
const path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev'; /* 可以传进一个变量，用来区分线上还是开发环境 */

// 获取html-webpack-plugin参数方法
var getHtmlConfig = function(name, title){
    return {
        template    : './src/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['common', name]
    };
};
//webpack config
var config = {
    entry: {
        'common' :['./src/page/common/index.js'],
        'index'  :['./src/page/index/index.js'],
        'login'  :['./src/page/login/index.js'],
        'result' :['./src/page/result/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),      // 配置的是存放文件的路径
        publicPath:'/dist',                         // 配置的是访问文件时的路径
        filename: 'js/[name].js'
    },
    externals:{
        'jquery':'window.jQuery'
    },
    module: {
        loaders: [
            { test: /\.css$/,  loader:  ExtractTextPlugin.extract("style-loader","css-loader") },
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },// limit参数小于100，转为base64，大于这个值，以文件形式存在
            { test: /\.string$/, loader: 'html-loader'}
        ]
    },
    resolve:{
        // 配置路径
        alias : {
            node_modules : __dirname + '/node_modules',
            util        : __dirname + '/src/util',
            page        : __dirname + '/src/page',
            service     : __dirname + '/src/service',
            image       : __dirname + '/src/image'
        }
    },
    plugins:[
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            //公共块的块名称
            name:'common',
            //公共块的块名称
            filename:'js/base.js'
        }),

        // 把css单独打包到文件
        new ExtractTextPlugin("css/[name].css"),

        // HTML模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login','用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result','操作结果'))
    ]
};

if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}


module.exports = config;