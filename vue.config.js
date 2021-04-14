
/*
 * @Author: your name
 * @Date: 2021-03-11 10:10:28
 * @LastEditTime: 2021-04-08 09:39:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\vue.config.js
 */

const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: './',
  // 生产打包的文件夹
  outputDir: 'quality-control-project',
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
    standardValueConfig: { // 跨度值标准值配置
      entry: './src/pages/StandardValueConfig/standardValueConfig.js',
      template: './public/index.html',
      filename: 'standardValueConfig.html',
      title: '跨度值标准值配置',
      chunks: ['chunk-vendors', 'chunk-common', 'standardValueConfig']
    },
    standardAudit: {  // 跨度值标准值审核
      entry: './src/pages/StandardAudit/standardAudit.js',
      template: './public/index.html',
      filename: 'standardAudit.html',
      title: '跨度值标准值审核',
      chunks: ['chunk-vendors', 'chunk-common', 'standardAudit']
    },
    StandardAuditPeople: { // 点位跨度值标准值审核人员分配
      entry: './src/pages/StandardAuditPeople/standardAuditPeople.js',
      template: './public/index.html',
      filename: 'standardAuditPeople.html',
      title: '点位跨度值标准值审核人员分配',
      chunks: ['chunk-vendors', 'chunk-common', 'StandardAuditPeople']
    },
    SupportDocument: { // 佐证材料
      entry: './src/pages/SupportDocument/SupportDocument.js',
      template: './public/index.html',
      filename: 'supportDocument.html',
      title: '佐证材料',
      chunks: ['chunk-vendors', 'chunk-common', 'SupportDocument']
    },
    WeekQualityData: { // 右键周质控
      entry: './src/pages/WeekQualityData/WeekQualityData.js',
      template: './public/index.html',
      filename: 'WeekQualityData.html',
      title: '周质控',
      chunks: ['chunk-vendors', 'chunk-common', 'WeekQualityData']
    },
    HistoryData: { // 右键历史数据
      entry: './src/pages/HistoryData/HistoryData.js',
      template: './public/index.html',
      filename: 'HistoryData.html',
      title: '周质控',
      chunks: ['chunk-vendors', 'chunk-common', 'HistoryData']
    },
    DailyQualityControl: {// 日质控
      // page 的入口
      entry: './src/pages/DailyQualityControl/DailyQualityControl.js',
      // 模板来源
      template: './public/index.html',
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
      template: './public/index.html',
      filename: 'ZeroPointData.html',
      title: '零点数据',
      chunks: ['chunk-vendors', 'chunk-common', 'ZeroPointData']
    },
    ZeroPointDataChart: { // 零点数据图表
      entry: './src/pages/ZeroPointDataChart/ZeroPointDataChart.js',
      template: './public/index.html',
      filename: 'ZeroPointDataChart.html',
      title: '零点数据图表',
      chunks: ['chunk-vendors', 'chunk-common', 'ZeroPointDataChart']
    },
    SpanData: { // 跨度数据
      entry: './src/pages/SpanData/SpanData.js',
      template: './public/index.html',
      filename: 'SpanData.html',
      title: '跨度数据',
      chunks: ['chunk-vendors', 'chunk-common', 'SpanData']
    },
    SpanDataChart: { // 跨度数据图表
      entry: './src/pages/SpanDataChart/SpanDataChart.js',
      template: './public/index.html',
      filename: 'SpanDataChart.html',
      title: '跨度数据图表',
      chunks: ['chunk-vendors', 'chunk-common', 'SpanDataChart']
    },
    StateParametersConfig: { // 状态参数配置
      entry: './src/pages/StateParametersConfig/StateParametersConfig.js',
      template: './public/index.html',
      filename: 'StateParametersConfig.html',
      title: '状态参数配置',
      chunks: ['chunk-vendors', 'chunk-common', 'StateParametersConfig']
    },
    FactorStateConfig: { // 因子状态配置
      entry: './src/pages/FactorStateConfig/FactorStateConfig.js',
      template: './public/index.html',
      filename: 'FactorStateConfig.html',
      title: '因子状态配置',
      chunks: ['chunk-vendors', 'chunk-common', 'FactorStateConfig']
    },
    WeekQualityControl: { // 周质控
      entry: './src/pages/WeekQualityControl/WeekQualityControl.js',
      template: './public/index.html',
      filename: 'WeekQualityControl.html',
      title: '周质控',
      chunks: ['chunk-vendors', 'chunk-common', 'WeekQualityControl']
    },
    WeekQualityControlDefect: { // 周质控缺失
      entry: './src/pages/WeekQualityControlDefect/WeekQualityControlDefect.js',
      template: './public/index.html',
      filename: 'WeekQualityControlDefect.html',
      title: '周质控缺失',
      chunks: ['chunk-vendors', 'chunk-common', 'WeekQualityControlDefect']
    },
    WeekQualityControlExamine: { // 周质控审核
      entry: './src/pages/WeekQualityControlExamine/WeekQualityControlExamine.js',
      template: './public/index.html',
      filename: 'WeekQualityControlExamine.html',
      title: '周质控审核',
      chunks: ['chunk-vendors', 'chunk-common', 'WeekQualityControlExamine']
    },
  },
  // 接口代理
  
  productionSourceMap: false,
  // 忽略编译
  transpileDependencies: [
    'vue-element-dialog-draggable'
  ],
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