<template>
  <div id="app">
    <div class="header">
      <div class="select">
        <span>站点：</span>
        <el-select v-model="pointValue" placeholder="请选择"  collapse-tags>
          <el-option-group
            v-for="(group,index) in pointList"
            :key="group.id"
            :label="group.title"
            style="width:600px;"
          >
            <el-option value :disabled="true">
              <el-radio-group v-model="areaPoint">
                <el-radio
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.id"
                  @change="handleCheckedChange(index)"
                >{{item.title}}</el-radio>
              </el-radio-group>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="select">
        <span>开始时间：</span>
        <el-date-picker
          v-model="strTime"
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>监测项目：</span>
        <el-select
          v-model="factorValue"
          multiple
          collapse-tags
          placeholder="请选择"
          @change="factorChange"
        >
          <el-option
            v-for="item in factorList"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button class="btn" type="primary" @click="search">查找</el-button>
      <el-button v-show="isExport" class="btn" type="warning" @click="exportTable">导出</el-button>
    </div>
    <div class="body" ref="spanChart">
      <el-tabs v-model="tabActive" type="card" @tab-click="changeClick">
        <el-tab-pane v-for="item in pageList" :key="item.title" :label="item.title"></el-tab-pane>
      </el-tabs>
      <div class="chart" :style="style" v-show="chartShow">
        <span>暂无数据</span>
      </div>
      <iframe ref="iframe" class="tebs" :src="pageUrl" frameborder="0" @load="iframeLoad('iframe')"></iframe>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      pointList: [],
      pointValue: '',
      strTime: "",
      endTime: "",
      factorList: [
        {
          title: "高锰酸盐指数",
          value: "w01019"
        },
        {
          title: "氨氮",
          value: "w21003"
        },
        {
          title: "总磷",
          value: "w21011"
        },
        {
          title: "总氮",
          value: "w21001"
        }
      ],
      factorValue: ["w01019", "w21003", "w21011", "w21001"],
      areaPoint: "",
      baseUrl: window.API,
      tabActive: "0",
      pageList: window.pageList,
      pageUrl: window.pageList[0].url,
      isExportTable: false,
      style: '',
      chartShow: false,
      isExport: true,
    };
  },
  mounted: function() {
    this.style =
      "width:" + this.$refs.spanChart.offsetWidth + ";height: "+ this.$refs.spanChart.offsetHeight +";"
    this.getTime();
    this.getPointList();
  },
  methods: {
    // 获取测点
    getPointList() {
      let url = this.baseUrl + "/audit/auth/pointTree";
      this.$axios
        .get(url, {
          params: {
            enviromentCode: "1"
          }
        })
        .then(res => {
          if (res.status == 200) {
            if (res.data.code == 200) {
              let obj = res.data;
              this.pointList = obj.data;
              this.pointValue = obj.data[0].children[0].title;
              this.areaPoint = obj.data[0].children[0].id;
            }
          }
        });
    },
    handleCheckedChange() {
      this.pointValue = '';
      this.pointList.map(item => {
        item.children.map(list => {
          if (this.areaPoint == list.id) {
            this.pointValue= list.title;
          }
        });
      });
    },
    // 查询
    search() {
      this.isExportTable = false;
      if (this.areaPoint === "") {
        alert("请选择站点！");
        return false;
      }
      if (this.strTime === "") {
        alert("请选择开始时间！");
        return false;
      }
      if (this.endTime === "") {
        alert("请选择结束时间！");
        return false;
      }
      if (new Date(this.strTime + ':00:00').getTime() >= new Date(this.endTime + ':00:00').getTime()) {
        alert("请选择正确的时间！");
        return false;
      }
      this.iframeParam();
    },
    // 切换因子触发
    factorChange() {
      if (this.tabActive == 1 || this.tabActive == 3) {
        if (this.factorValue.length === 0){
          this.chartShow= true;
        } else {
          this.chartShow= false;
        }
      } else {
        this.chartShow= false;
      }
      this.iframeParam();
    },
    // 点击tab切换
    changeClick() {
      if (this.tabActive == 1 || this.tabActive == 3) {
        this.isExport = false;
        if (this.factorValue.length === 0){
          this.chartShow= true;
        } else {
          this.chartShow= false;
        }
      } else {
        this.isExport = true;
        this.chartShow= false;
      }
      let url = this.pageList[this.tabActive].url;
      this.pageUrl = url;
      this.iframeParam();
    },
    iframeLoad() {
      this.iframeParam();
    },
    // 导出
    exportTable(){
      this.isExportTable = true;
      this.iframeParam()
    },
    // iframe广播参数
    iframeParam() {
      let iframeWin = this.$refs.iframe.contentWindow;
      if (this.strTime === null) {
        this.strTime = "";
      }
      if (this.endTime === null) {
        this.endTime = "";
      }
      let obj = {
        factorList: this.factorValue,
        pointId: this.areaPoint,
        strTime: this.strTime,
        endTime: this.endTime,
        isExport: this.isExportTable
      };
      console.log(obj);
      iframeWin.postMessage(
        {
          //参数是对象
          params: obj
        },
        "*"
      );
      this.isExportTable = false;
    },
    // 获取当前时间
    getTime() {
      let date = new Date();
      let year = date.getFullYear();
      let mounth = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let str;
      let _day;
      let _hours;
      let time1,time2;
      day < 10 ? _day = '0' + day : _day = day;
      hours < 10 ? _hours = '0' + hours : _hours = hours;
      mounth < 10 ? time1 = '0' + (mounth - 1) : time1 = mounth;
      mounth < 10 ? time2 = '0' + mounth : time2 = mounth;
      if (mounth == "1") {
        str = (year - 1) + "-12-" + _day + " " + _hours;
      } else if(mounth == "3"){
        str = year + "-03-01" + " " + _hours;
      } else {
        str = year + "-" + time1 + "-" + _day + " " + _hours;
      }
      let end = year + "-" + time2 + "-" + _day + " " + _hours;
      console.log(end)
      this.strTime = str;
      this.endTime = end;
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
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
/* 头部查询 */
.header {
  display: flex;
  flex-wrap: wrap;
}
.select {
  display: flex;
  margin: 10px;
  width: 260px;
  font-size: 14px;
}
.select > span {
  display: inline-block;
  width: 90px;
  text-align: left;
  line-height: 30px;
}
.header > .el-button {
  height: 30px;
  margin: 10px;
  line-height: 0;
}
.el-radio {
  margin-bottom: 12px !important;
}
.el-radio__inner {
  border-radius: 0 !important;
}
.el-select-dropdown__item {
  white-space: normal !important;
  height: auto !important;
  padding: 0 !important;
  padding-left: 30px !important;
}
.el-select-group > .el-checkbox {
  margin-left: 10px !important;
}
.el-select-group__title {
  font-size: 14px !important;
  font-weight: bold !important;
}
.el-select-group__wrap {
  padding-bottom: 16px !important;
}
.el-checkbox-group > .el-checkbox {
  margin-right: 12px !important;
}
.el-tag__close {
  display: none !important;
}
.el-scrollbar:nth-of-type(1) {
  width: 95% !important;
}
.el-scrollbar:nth-of-type(2),
.el-scrollbar:nth-of-type(3) {
  display: none !important;
}
/* 底部tabs */
.body {
  flex: 1;
  margin: 0 10px;
  /* width: 100%;
  height: 100%; */
}
.tebs {
  width: 100%;
  height: calc(100% - 100px);
}
.chart {
  min-height: 60px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart span{
  font-size: 12px;
  width: 50%;
  color: #909399;
}
</style>