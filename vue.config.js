
/*
 * @Author: your name
 * @Date: 2021-03-11 10:10:28
 * @LastEditTime: 2021-03-22 14:32:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\vue.config.js
 */
module.exports = {
  publicPath: './',
  pages: {
    dataAudit: { // 日志
      entry: './src/pages/auditIndex/dataAudit.js',
      templete: './public/index.html',
      filename: 'dataAudit.html',
      title: '因子审核日志',
      chunks: ['chunk-vendors', 'chunk-common', 'dataAudit']
    },
    zeroSkip: { // 零点跨度
      entry: './src/pages/zeroSkip/zeroSkip.js',
      templete: './public/index.html',
      filename: 'zeroSkip.html',
      title: '零点跨度数据',
      chunks: ['chunk-vendors', 'chunk-common', 'zeroSkip']
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
}