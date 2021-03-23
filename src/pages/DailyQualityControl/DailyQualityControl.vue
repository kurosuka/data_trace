<template>
  <div id="dayAuto">
    <div class="header">
      <div class="select">
        <span>站点：</span>
        <el-select v-model="pointValue" placeholder="请选择" multiple collapse-tags>
          <el-option-group
            v-for="(group,index) in pointList"
            :key="group.id"
            :label="group.title"
            style="width:600px;"
          >
            <el-option value :disabled="true">
              <el-checkbox-group v-model="areaPoint">
                <el-checkbox
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.id"
                  @change="handleCheckedChange(index)"
                >{{item.title}}</el-checkbox>
              </el-checkbox-group>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="select">
        <span>开始时间：</span>
        <el-date-picker v-model="strTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker v-model="endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div class="select">
        <span>监测项目：</span>
        <el-select v-model="factorValue" placeholder="请选择">
          <el-option
            v-for="item in factorList"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button class="btn" type="primary" @click="search">查找</el-button>
    </div>
    <div class="body">
      <el-tabs type="border-card" @tab-click="changeClick">
        <el-tab-pane label="零点数据">
          <iframe src frameborder="0"></iframe>
        </el-tab-pane>
        <el-tab-pane label="零点数据图表">
          <iframe src frameborder="0"></iframe>
        </el-tab-pane>
        <el-tab-pane label="跨度数据">
          <iframe src frameborder="0"></iframe>
        </el-tab-pane>
        <el-tab-pane label="跨度数据图表">
          <iframe src frameborder="0"></iframe>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      pointList: [],
      pointValue: [],
      strTime: "",
      endTime: "",
      factorList: [],
      factorValue: [],
      areaPoint: [],
      baseUrl: "http://183.166.140.243:8088"
    };
  },
  mounted: function() {
    this.getPointList();
  },
  methods: {
    // 获取测点
    getPointList() {
      let url = this.baseUrl + "/api/audit/auth/pointTree";
      this.$axios
        .get(url, {
          params: {
            enviromentCode: "1"
          }
        })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            if (res.data.code == 200) {
              this.pointList = res.data.data;
            }
          }
        });
    },
    handleCheckedChange(index) {
      console.log(index);
    },
    // 查询
    search() {},
    // 点击tab切换
    changeClick(targetName) {
      console.log(targetName);
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
#dayAuto {
  display:flex;
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
  margin: 20px 10px 20px 10px;
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
  margin-top: 20px;
  margin-left: 20px;
  line-height: 0;
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
.el-select-group__title{
  font-size: 14px !important;
  font-weight: bold !important;
}
.el-select-group__wrap {
  padding-bottom: 18px !important;
}
.el-checkbox-group > .el-checkbox {
  margin-right: 12px !important;
}
/* 底部tabs */
.body {
  flex: 1;
  margin: 0 10px;
  /* width: 100%;
  height: 100%; */
}
</style>