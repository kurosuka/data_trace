<template>
  <div id="app">
    <div class="header">
      <div class="select">
        <span>站点：</span>
        <el-select v-model="pointValue" placeholder="请选择">
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
        <span>监测因子：</span>
        <el-select v-model="factorValue" multiple collapse-tags placeholder="请选择">
          <el-option
            v-for="item in factorList"
            :key="item.factorCode"
            :label="item.factorName"
            :value="item.factorCode"
          ></el-option>
        </el-select>
      </div>
      <div class="select">
        <span>合格情况：</span>
        <el-select v-model="standardValue" multiple collapse-tags placeholder="请选择">
          <el-option
            v-for="item in standardList"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button class="btn" type="primary" @click="search">查找</el-button>
    </div>
    <div class="body">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column fixed label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column
          v-for="(item) in label"
          :key="item.title"
          :label="item.title"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          align="center"
          min-width="150px"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[15, 20, 30]"
        :page-size="size"
        style="float:right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      pointList: [],
      pointValue: "",
      areaPoint: "",
      strTime: "",
      endTime: "",
      factorList: [],
      factorValue: [],
      standardList: [
        {
          title: "合格",
          value: "合格"
        },
        {
          title: "不合格",
          value: "不合格"
        },
        {
          title: "无法判断",
          value: "无法判断"
        }
      ],
      standardValue: ["合格", "不合格", "无法判断"],
      tableList: [],
      label: [],
      total: 0,
      page: 0,
      size: 15,
      loading: false,
      baseUrl: window.configUrl
    };
  },
  mounted: function() {
    this.getTime();
    this.getPointList();
    this.getFactorList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    //分页条件
    handleSizeChange(val) {
      this.size = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableList();
    },
    // 获取点位信息
    getPointList() {
      let url = this.baseUrl + "/weekQuality/getPointList";
      this.$axios.get(url).then(res => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.code == 200) {
            let list = res.data.data;
            this.pointList = list;
            this.pointValue = list[0].children[0].title;
            this.areaPoint = list[0].children[0].id;
            this.getTableList();
          }
        }
      });
    },
    handleCheckedChange() {
      this.pointValue = "";
      this.pointList.map(item => {
        item.children.map(list => {
          if (this.areaPoint == list.id) {
            this.pointValue = list.title;
          }
        });
      });
    },
    // 获取因子信息
    getFactorList() {
      let url = this.baseUrl + "/weekQuality/queryWeekFactorList";
      this.$axios.get(url).then(res => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.code == 200) {
            let arr = [];
            this.factorList = res.data.data;
            this.factorList.map(item => {
              console.log(item);
              arr.push(item.factorCode);
            });
            this.factorValue = arr;
            // this.getTableList();
          }
        }
      });
    },
    // 获取表格数据
    getTableList() {
      let url = this.baseUrl + "/weekQuality/queryWeekCheckList";
      let obj = {
        pointId: this.areaPoint,
        factorCodeList: this.factorValue,
        isqualifiedList: this.standardValue,
        startTime: this.strTime,
        endTime: this.endTime,
        pageNo: this.page,
        pageSize: this.size
      };
      this.$axios.post(url, obj).then(res => {
        console.log(res)
        let val = res.data.data;
        this.total = val.total;
        this.size = val.size;
        this.page = val.current;
        let list = val.records;
        let cloneList = JSON.parse(JSON.stringify(list));
        this.tableList = cloneList.map(item => {
          if (item.flagEnable === 0) {
            item.flagEnable = "否";
          } else if (item.flagEnable == 1) {
            item.flagEnable = "是";
          }
          return item;
        });
        let _tableList = {
          factorName: "站点名称",
          paramCode: "日期",
          paramName: "监测项目",
          typeName: "仪器值",
          measureUnitName: "标液编号",
          decimalNumber: "标准液浓度",
          upperValue: "误差",
          lowerValue: "技术要求",
          lowerValue1: "合格情况",
        };
        let labelList = Object.entries(_tableList);
        this.label = labelList.map(function(item) {
          return {
            title: item[1],
            prop: item[0]
          };
        });
      });
    },
    // 查询
    search() {
      console.log(this.strTime);
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
      let time1, time2;
      day < 10 ? (_day = "0" + day) : (_day = day);
      hours < 10 ? (_hours = "0" + hours) : (_hours = hours);
      mounth < 10 ? (time1 = "0" + (mounth - 1)) : (time1 = mounth);
      mounth < 10 ? (time2 = "0" + mounth) : (time2 = mounth);
      if (mounth == "1") {
        str = year - 1 + "-12-" + _day + " " + _hours;
      } else if (mounth == "3") {
        str = year + "-03-01" + " " + _hours;
      } else {
        str = year + "-" + time1 + "-" + _day + " " + _hours;
      }
      let end = year + "-" + time2 + "-" + _day + " " + _hours;
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
.page {
  padding-right: 5px;
  padding-bottom: 5px;
}
</style>