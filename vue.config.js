'use strict'
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
// const defaultSettings = require("./src/config/index.js");
// 生产环境，测试和正式
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
console.log(process.env.NODE_ENV)

const webpack = require('webpack')

module.exports = {
  publicPath: './', // 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
  outputDir: 'dist', // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  assetsDir: 'static', //放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
  indexPath: 'index.html', //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
  pages: {
    //pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错
    index: {
      //除了 entry 之外都是可选的
      entry: 'src/main.js', // page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
      template: 'public/index.html', // 模板来源
      filename: 'index.html', // 在 dist/index.html 的输出
      title: 'd3.js的简单使用', // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ['chunk-vendors', 'chunk-common', 'index'], // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
    },
    // subpage: "src/subpage/main.js" //官方解释：当使用只有入口的字符串格式时,模板会被推导为'public/subpage.html',若找不到就回退到'public/index.html',输出文件名会被推导为'subpage.html'
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 别名 alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))

    config.module.rule('pug')
      .test(/\.pug$/)  
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end()
  },

  lintOnSave: true, // 是否在保存的时候检查
  productionSourceMap: true, // 生产环境是否生成 sourceMap 文件
  css: {
    extract: IS_PROD, //  是否使用css分离插件 ExtractTextPlugin,是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    requireModuleExtension: true, // 启用 CSS modules for all css / pre-processor files.
    sourceMap: false,
  },
  devServer: {
    // 环境配置
    host: 'localhost',
    port: 8090,
    https: false,
    hotOnly: true,
    open: true, //配置自动启动浏览器
    proxy: {
      // 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
      '/api': {
        target: '<url>',
        ws: true,
        changeOrigin: true,
      },
      '/foreign': {
        target: 'http://59.110.136.199:8080/Foreign/foreign', // 设置你调用的接口域名和端口号
        changeOrigin: true, // 跨域
        pathRewrite: {
          '^/foreign': '/',
        },
      },
    },
  },
  pluginOptions: {
    // 第三方插件配置
    // ...
  },
  configureWebpack: {
    externals: {
      // "AMap": "AMap"
    },
  },
}
