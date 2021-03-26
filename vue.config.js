
/*
 * @Author: your name
 * @Date: 2021-03-11 10:10:28
 * @LastEditTime: 2021-03-24 17:14:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\vue.config.js
 */

const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: './',
  pages: {
    dataAudit: { // 日志
      entry: './src/pages/auditIndex/dataAudit.js',
      template: './public/index.html',
      filename: 'dataAudit.html',
      title: '因子审核日志',
      chunks: ['chunk-vendors', 'chunk-common', 'dataAudit']
    },
    zeroSkip: { // 零点跨度
      entry: './src/pages/zeroSkip/zeroSkip.js',
      template: './public/index.html',
      filename: 'zeroSkip.html',
      title: '零点跨度数据',
      chunks: ['chunk-vendors', 'chunk-common', 'zeroSkip']
    },
    stantardValueConfig: { // 跨度值标准值配置
      entry: './src/pages/StantardValueConfig/stantardValueConfig.js',
      template: './public/index.html',
      filename: 'stantardValueConfig.html',
      title: '跨度值标准值配置',
      chunks: ['chunk-vendors', 'chunk-common', 'stantardValueConfig']
    },
    stantardAudit: {  // 跨度值标准值审核
      entry: './src/pages/StantardAudit/stantardAudit.js',
      template: './public/index.html',
      filename: 'stantardAudit.html',
      title: '跨度值标准值审核',
      chunks: ['chunk-vendors', 'chunk-common', 'stantardAudit']
    },
    StantardAuditPeople: { // 点位跨度值标准值审核人员分配
      entry: './src/pages/StantardAuditPeople/stantardAuditPeople.js',
      template: './public/index.html',
      filename: 'stantardAuditPeople.html',
      title: '点位跨度值标准值审核人员分配',
      chunks: ['chunk-vendors', 'chunk-common', 'StantardAuditPeople']
    },
    DailyQualityControl: {
      // page 的入口
      entry: './src/pages/DailyQualityControl/DailyQualityControl.js',
      // 模板来源
      template: './src/pages/DailyQualityControl/DailyQualityControl.html',
      // 在 dist/index.html 的输出
      filename: 'DailyQualityControl.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '日质控',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'DailyQualityControl'],  
    },
    ZeroPointData: { // 零点数据
      entry: './src/pages/ZeroPointData/ZeroPointData.js',
      template: './src/pages/ZeroPointData/ZeroPointData.html',
      filename: 'ZeroPointData.html',
      title: '零点数据',
      chunks: ['chunk-vendors', 'chunk-common', 'ZeroPointData']
    },
    ZeroPointDataChart: { // 零点数据图表
      entry: './src/pages/ZeroPointDataChart/ZeroPointDataChart.js',
      template: './src/pages/ZeroPointDataChart/ZeroPointDataChart.html',
      filename: 'ZeroPointDataChart.html',
      title: '零点数据图表',
      chunks: ['chunk-vendors', 'chunk-common', 'ZeroPointDataChart']
    },
    SpanData: { // 跨度数据
      entry: './src/pages/SpanData/SpanData.js',
      template: './src/pages/SpanData/SpanData.html',
      filename: 'SpanData.html',
      title: '跨度数据',
      chunks: ['chunk-vendors', 'chunk-common', 'SpanData']
    },
    SpanDataChart: { // 跨度数据图表
      entry: './src/pages/SpanDataChart/SpanDataChart.js',
      template: './src/pages/SpanDataChart/SpanDataChart.html',
      filename: 'SpanDataChart.html',
      title: '跨度数据图表',
      chunks: ['chunk-vendors', 'chunk-common', 'SpanDataChart']
    },
  },
  // 接口代理
  
  productionSourceMap: false,
  configureWebpack: config => {
    // 生产环境下生效
    if (process.env.NODE_ENV === 'production') {
      // 配置删除 console.log
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
},
// 修改路径
chainWebpack: config => {
  // 添加别名
  config.resolve.alias
    .set("vue$", "vue/dist/vue.esm.js")
    .set("@", resolve("src"))
    .set("@assets", resolve("src/assets"))
    .set("@scss", resolve("src/assets/scss"))
    .set("@components", resolve("src/components"))
    .set("@plugins", resolve("src/plugins"))
    .set("@views", resolve("src/views"))
    .set("@router", resolve("src/router"))
    .set("@store", resolve("src/store"))
}
}