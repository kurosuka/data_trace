<!--
 * @Author: your name
 * @Date: 2021-05-07 09:35:38
 * @LastEditTime: 2021-05-07 09:58:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\RightProcessLog\index.vue
-->
<template>
  <div class="main">
    <el-table :data="tableData" :default-expand-all="true" :show-header="false">
      <el-table-column label="监测时间" prop="name" ></el-table-column>
      <el-table-column  type="expand" prop="id">
        <template slot-scope="scope">
          <el-table :data="list" :show-header="scope.row.id == 'i11001'" stripe width="100%" border>
            <el-table-column label="监测时间" prop="time"></el-table-column>
            <el-table-column label="日志" :prop="scope.row.id" align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryParamProcessLog } from './request.js';
import { getUrlParams } from '../../js/utils.js';
const moment = require('moment');
export default {
  data() {
    return {
      tableData: [
        {
          id: 'i11001',
          name: '仪器日志'
        },
        {
          id: 'i21001',
          name: '流程日志'
        }
      ], // 流程日志表格数据
      list: [],
      options: {},
    }
  },
  mounted() {
     this.options = getUrlParams(self.location.href);
     this.getQueryParamByPointFactor();
  },
  methods: {
    async getQueryParamByPointFactor() {
      let start = this._decodeURIComponent(`${this.options.time}:00:00`);
      let end = moment(start).add(3, 'hours').format('YYYY-MM-DD HH:59:59');
      await queryParamProcessLog({
        fromTime: start,
        toTime: end,
        factorCode: this._decodeURIComponent(this.options.pollutantCode),
        snCriteria: {
          orderNum: 9999,
          sn: /* 1 */this._decodeURIComponent(this.options.pointId),
          snName: this._decodeURIComponent(this.options.pointName)
        },
        fields: [
          {
            "field":"i11001"
        },
        {
            "field":"i21001"
        }
        ]
      }).then(res=> {
        this.list = res.data.data;
      })
    },
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    },
  }
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
.el-pagination {
  float: right;
  margin-top: 10px;
}
.el-table__expanded-cell[class*=cell] {
  padding: 0 !important;
}
</style>