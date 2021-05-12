/*
 * @Author: your name
 * @Date: 2021-03-11 13:34:08
 * @LastEditTime: 2021-05-10 14:55:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\public\config.js
 */

// API接口地址（正式）
window.API = 'http://183.166.140.243:8088/api';

// API接口地址（测试）
window.testUrl = 'http://192.168.90.41:8024/api';
window.configUrl = 'http://192.168.90.55:9082/api';

window.pageList = [{
    title: '零点数据',
    url: 'http://192.168.90.35:8080/ZeroPointData.html'
  },
  {
    title: '零点数据图表',
    url: 'http://192.168.90.35:8080/ZeroPointDataChart.html'
  },
  {
    title: '跨度数据',
    url: 'http://192.168.90.35:8080/SpanData.html'
  },
  {
    title: '跨度数据图表',
    url: 'http://192.168.90.35:8080/SpanDataChart.html'
  }
]
// 数据详情