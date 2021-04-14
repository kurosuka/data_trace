/*
 * @Author: your name
 * @Date: 2021-04-08 10:21:52
 * @LastEditTime: 2021-04-08 17:39:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\HistoryData\getLineCharts.js
 */

export function getLineCharts(data, el) {
  const dataTime = data[0].map(item=> {
    return item.time;
  });
  const xAxis = {
    type: 'category',
    data: dataTime
  };
  const yAxis= {
    type: 'value'
  };
/* const seriesData = data.map(item => {
  return [
    item.time,
    item.value
  ]
}) */
const options =  {
  xAxis: xAxis,
  yAxis: yAxis,
  legend: {
    data: ['所有数据', '有效数据']
  },
  grid: {
    left: '0%',
    right: '2%',
    bottom: '8%',
    top: '30px',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    right: '10px',
    top: '-5px',
    feature: {
      saveAsImage: {
        type: 'png',
        show: true,
        excludeComponents: ['toolbox','dataZoom'],
      }
    }
  },
  dataZoom: [{
    type: 'slider',
    show: true,
    showDetail: false,
    xAxisIndex: [0],
    left: '25px',
    right: '20px',
    bottom: '-5',
    start: 0,
    end: 100 //初始化滚动条
}],
  series: data.map((item, index)=> {
    let tname = index === 0 ? '所有数据' : '有效数据' 
    return {
      name: tname,
      symbol: 'circle',
      symbolSize: 6,
      connectNulls: false,
      data: item.map(ite=> {
        return  dataTime.includes(ite.time) ? ite.value : null
      }),
      type: 'line'
    }
  })
}
console.log(options);
el.setOption(options)
}