
/*
 * @Author: your name
 * @Date: 2021-03-11 13:34:08
 * @LastEditTime: 2021-05-10 14:55:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\public\config.js
 */

const pageUrl = 'http://183.166.140.243:8087/HS_water_WebUI/QualityControl';

// API接口地址
window.API = 'http://183.166.140.243:8088/api';
// window.API = 'http://192.168.90.55:9082/api';

window.pageList = [{
    title: '零点数据',
    url: `${pageUrl}/ZeroPointData.html`
  },
  {
    title: '零点数据图表',
    url: `${pageUrl}/ZeroPointDataChart.html`
  },
  {
    title: '跨度数据',
    url: `${pageUrl}/SpanData.html`
  },
  {
    title: '跨度数据图表',
    url: `${pageUrl}/SpanDataChart.html`
  }
]
