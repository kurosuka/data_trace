<template>
  <div id="app" ref="spanChart">
    <div class="chart" v-for="(item) in factor" :key="item" :id="item" :style="style"></div>
  </div>
</template>

<script>
import { Line } from "../../js/line.js";
export default {
  data: function() {
    return {
      factor: [],
      paramValue: {},
      style: "",
      baseUrl: window.API,
    };
  },
  mounted: function() {
    this.style =
      "width:" + this.$refs.spanChart.offsetWidth + ";height:400px;";
    this.getValue();
  },
  methods: {
    // 获取外部数据
    getValue() {
      window.addEventListener("message", eve => {
        let data = eve.data;
        if (data.params !== undefined) {
          this.factor = data.params.factorList;
          this.paramValue["dtFrom"] = data.params.strTime;
          this.paramValue["dtTo"] = data.params.endTime;
          this.paramValue["pointId"] = data.params.pointId;
          setTimeout(() => {
            this.getChartList();
          }, 100);
        }
      });
    },
    // 获取图表数据
    getChartList() {
      let url = this.baseUrl + "/quality/zeroDrift";
      // let param = {
      //   dtFrom: "2019-10-13 02",
      //   dtTo: "2019-10-26 02",
      //   pointId: "26"
      // };
      let param = this.paramValue;
      this.$axios.post(url, param).then(res => {
        if (res.status == 200) {
          if (res.data.code == 200) {
            if(res.data.data === null){
              this.loading = false
              return false;
            }
            let obj = res.data.data;
            console.log(obj);
            this.factor.map(item => {
              let value = obj.filter(list => {
                return list.codeId == item;
              });
              let chart = this.echarts.init(document.getElementById(item));
              chart.setOption(Line(value, "24小时零点漂移历史数据"));
            });
          }
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
#app {
  width: 100%;
  height: 100%;
}
.chart {
  margin-top: 20px;
}
</style>