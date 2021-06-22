export function Line(arr, chartTitle) {
  console.log(arr)
  let title = [];
  let time = [];
  let _time;
  let series;
  if (arr.length === 0) {
    title = null;
    series = [];
  } else {
    let val = [];
    title.push(arr[0].paramName);
    arr.map((item) => {
      time.push(item.dataTime);
    });
    _time = Array.from(new Set(time));
    _time = _time.slice(0).sort((a, b) => (a < b ? -1 : 1));
    _time.map(list => {
      let valueList = arr.filter((item) => {
        if (item.dataTime == list) {
          return item
        } else {
          return null
        }
      });
      if (valueList.length === 0) {
        val.push(null);
      } else if (valueList.length > 0) {
        let cloumn = valueList[0].zdRate;
        cloumn === null ? val.push(null) : val.push(cloumn.split('%')[0]);
      }
    })
    series = [{
      name: arr[0].paramName,
      type: 'line',
      smooth: true,
      data: val
    }];
  }
  let option = {
    title: {
      text: chartTitle,
      padding: [5, 0, 0, 20]
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
      data: _time,
    },
    yAxis: {
      type: 'value',
      name: '相对误差(%)'
    },
    series: series
  };
  return option;
}