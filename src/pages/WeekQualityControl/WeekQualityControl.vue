<template>
  <div id="app">
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
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>监测因子：</span>
        <el-select
          v-model="factorValue"
          multiple
          collapse-tags
          placeholder="请选择"
        >
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
        <el-select
          v-model="standardValue"
          placeholder="请选择"
        >
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
          v-for="(item) in label" :key="item.title"
          :label="item.title"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          align="center"
          min-width="150px"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      pointList: [],
      pointValue: [],
      areaPoint: [],
      strTime: '',
      endTime: '',
      factorList: [
        {
          title: '水温',
          value: '0'
        },
        {
          title: 'PH',
          value: '1'
        },
        {
          title: '溶解氧',
          value: '2'
        },
        {
          title: '电导率',
          value: '3'
        },
        {
          title: '浊度',
          value: '4'
        },
      ],
      factorValue: [],
      standardList: [
        {
          title: '合格',
          value: '1'
        },
        {
          title: '不合格',
          value: '0'
        }
      ],
      standardValue: '',
      tableList: [],
      label: [],
      loading: false,
      baseUrl: window.configUrl
    }
  },
  mounted: function(){
    this.getPointList();
    this.getFactorList();
  },
  methods: {
    indexMethod(index) {
      return index+1;
    },
    // 获取点位信息
    getPointList(){
      let url = this.baseUrl + '/weekQuality/getPointList';
      this.$axios.get(url).then(res => {
        console.log(res)
        if(res.status == 200){
          if(res.data.code == 200){
            this.pointList = res.data.data;
            // this.getTableList();
          }
        }
      })
    },
    // 获取因子信息
    getFactorList(){
      let url = this.baseUrl + '/weekQuality/queryWeekFactorList';
      this.$axios.get(url).then(res => {
        console.log(res)
        if(res.status == 200){
          if(res.data.code == 200){
            this.factorList = res.data.data;
            // this.getTableList();
          }
        }
      })
    },
    handleCheckedChange(){},
    // 获取表格数据
    getTableList(){
      
    },
    // 查询
    search(){
      
    },
  }
}
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
/* 底部tabs */
.body {
  flex: 1;
  margin: 0 10px;
  /* width: 100%;
  height: 100%; */
}
</style>