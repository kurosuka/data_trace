<!--
 * @Author: your name
 * @Date: 2021-04-07 11:28:55
 * @LastEditTime: 2021-04-23 09:47:11
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
            type="datetime"
            :clearable="false"
            :editable="false"
            value-format="yyyy-MM-dd HH"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          :clearable="false"
          :editable="false"
          value-format="yyyy-MM-dd HH"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column label="序号" type="index" align="center" :resizable="false"></el-table-column>
      <el-table-column label="站点名称" align="center" :resizable="false" prop="pointName"></el-table-column>
      <el-table-column label="日期" align="center" :resizable="false" prop="dateTime"></el-table-column>
      <el-table-column label="监测项目" align="center" :resizable="false" prop="factorName"></el-table-column>
      <el-table-column label="仪器值" align="center" :resizable="false" prop="checkValue"></el-table-column>
      <el-table-column label="标液编号" align="center" :resizable="false" prop="solutionNumber"></el-table-column>
      <el-table-column label="标准液浓度" align="center" :resizable="false" prop="standardValue"></el-table-column>
      <el-table-column label="误差" align="center" :resizable="false" prop="errorValue"></el-table-column>
      <el-table-column label="技术要求" align="center" :resizable="false" prop="technicalConditions"></el-table-column>
      <el-table-column label="合格情况" align="center" :resizable="false" prop="isqualified"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
      layout="total, sizes, prev, pager, next" :total="total" style="float: right;"
      hide-on-single-page>
    </el-pagination>
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
      options: {},
      currentPage: 1,
      total: 0,
      pageSizes: [10, 20, 30],
      pageSize: 20,
    }
  },
  mounted() {
    this.options = getUrlParams(self.location.href);
    this.form.startTime = moment(this._decodeURIComponent(this.options.time)).subtract(30, 'd').format('YYYY-MM-DD HH:00:00');
    this.form.endTime = moment(this._decodeURIComponent(this.options.time)).add(1, 'd').format('YYYY-MM-DD HH:00:00');
    this.getWeekList();
  },
  methods: {
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    },
    getWeekList() {
      const data = {
        endTime: moment(this.form.endTime).format('YYYY-MM-DD HH'),
        startTime: moment(this.form.startTime).format('YYYY-MM-DD HH'),
        factorCodeList: [this.options.pollutantCode],
        /* isqualifiedList: ['合格', '不合格', '无法判定'], */
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        pointId: this.options.pointId
      };
      this.$axios({
        method: 'post',
        url: 'http://192.168.90.55:9082/api/weekQuality/queryWeekCheckList',
        data: data,
        headers: {'content-type': 'application/json;charset=UTF-8'}
      }).then(res=> {
        console.log(res);
        this.tableData = res.data.data.records;
        this.pageSize = res.data.data.size;
        this.total = res.data.data.total;
        this.currentPage = res.data.data.current
      })
    },
    //每页条数
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    }
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