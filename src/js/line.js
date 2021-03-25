export function Line(arr, time, chartTitle) {
  console.log(arr)
  let title = [];
  
  let series;
  if (arr.length === 0) {
    title = null;
    series = [];
  } else {
    let val = [];
    // time.map(list => {
    //   console.log(list)
    //   arr.map((item) => {
        
    //     let cloumn = item.wcRate;
    //     val.push(cloumn.split('%')[0])
    //   });
    // })
    
    title.push(arr[0].paramName);
    arr.map((item) => {
      console.log(item)
      let cloumn = item.wcRate;
      val.push(cloumn.split('%')[0])
    });
    series = [{
      name: arr[0].paramName,
      type: 'line',
      smooth: true,
      data: val
    }];
  }
  let option = {
    title: {
      text: chartTitle
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: title,
      // orient:'vertical'
    },
    grid: {
      left: '6%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true,
      feature: {
          saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: time,
      // axisLabel: {
      //   rotate: 60
      // },
    },
    yAxis: {
      type: 'value',
      name: '相对误差(%)'
    },
    series: series
  };
  console.log(option)
  return option
}