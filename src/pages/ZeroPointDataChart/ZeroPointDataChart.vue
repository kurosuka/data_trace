<template>
  <div id="pointDataChart" ref="spanChart">
    <div v-for="(item) in factor" :key="item" :id="item" :style="style"></div>
  </div>
</template>

<script>
import { Line } from "../../js/line.js";
export default {
  data: function() {
    return {
      factor: ["w01019", "w21003", "w21011", "w21001"],
      style:'',
      baseUrl: "http://192.168.90.8:8081"
    };
  },
  mounted: function() {
    this.style = 'width:'+this.$refs.spanChart.offsetHeight+';height:400px;';
    this.getChartList();
  },
  methods: {
    // 获取图表数据
    getChartList() {
      let url = this.baseUrl + "/api/quality/zeroDrift";
      let param = {
        dtFrom: "2019-10-13 02",
        dtTo: "2019-10-26 02",
        pointId: "26"
      };
      this.$axios.post(url, param).then(res => {
        if (res.status == 200) {
          let obj = res.data.data;
          console.log(obj);
          let time = [];
          obj.map(item => {
            time.push(item.dataTime);
          });
          let _time = Array.from(new Set(time));
          this.factor.map(item => {
            let value = obj.filter(list => {
              return list.codeId == item;
            });
            let chart = this.echarts.init(document.getElementById(item));
            chart.setOption(Line(value, _time,'24小时零点漂移历史数据'));
          });
        }
      });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
#pointDataChart {
  width: 100%;
  height: 100%;
}
</style>