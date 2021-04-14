<!--
 * @Author: your name
 * @Date: 2021-04-07 11:28:55
 * @LastEditTime: 2021-04-12 15:05:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\WeekQualityData.vue
-->
<template>
  <div class="week-quality">
    <el-form :model="form" inline size="mini">
      <el-form-item label="开始时间">
         <el-date-picker
            v-model="form.startTime"
            format="yyyy-MM-dd"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.endTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          :clearable="false"
          :editable="false"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column label="序号" type="index" align="center" :resizable="false"></el-table-column>
      <el-table-column label="监测时间" align="center" :resizable="false"></el-table-column>
      <el-table-column label="审核时间" align="center" :resizable="false"></el-table-column>
      <el-table-column label="监测项目" align="center" :resizable="false"></el-table-column>
      <el-table-column label="单位" align="center" :resizable="false"></el-table-column>
      <el-table-column label="仪器测试值" align="center" :resizable="false"></el-table-column>
      <el-table-column label="标准液浓度" align="center" :resizable="false"></el-table-column>
      <el-table-column label="误差" align="center" :resizable="false"></el-table-column>
      <el-table-column label="是否合格" align="center" :resizable="false"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUrlParams } from '../js/utils';
const moment = require('moment');
export default {
  name: 'WeekQualityData',
  data() {
    return {
      tableData: [], // 周质控数据
      form: {
        startTime: '',
        endTime: ''
      },
      options: {}
    }
  },
  mounted() {
    this.options = getUrlParams(self.location.href);
    this.form.startTime = moment(this._decodeURIComponent(this.options.time).slice(0, 10)).subtract(6, 'd').format('YYYY-MM-DD');
    this.form.endTime = moment(this._decodeURIComponent(this.options.time).slice(0, 10)).add(1, 'd').format('YYYY-MM-DD');
  },
  methods: {
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    },
  }
}
</script>

<style lang="scss" scoped>
.navlist {
    background: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    font-size: 12px;
    color: #666;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    div {
      margin-right: 18px;
    }
    span {
      margin-left: 10px;
      display: inline-block;
    }
  }
</style>