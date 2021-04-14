<!--
 * @Author: your name
 * @Date: 2021-03-11 09:33:31
 * @LastEditTime: 2021-04-07 14:25:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\Auditlog.vue
-->
<template>
  <div class="auditlog" v-loading="loading">
    <el-table :data="logData" height="calc(100% - 80px)">
      <el-table-column label="" type="index"></el-table-column>
      
      <el-table-column label="数据时间" prop="dataTime"></el-table-column>
      <el-table-column label="操作时间" prop="opTime"></el-table-column>
      <el-table-column label="操作人员" prop="userName"></el-table-column>
      <el-table-column label="测点" prop="pointName"></el-table-column>
      <el-table-column label="类型" prop="opTypeEnum"></el-table-column>
      <el-table-column label="原始值" prop="srcValue">
        <template slot-scope="scope">
          {{scope.row.srcValue === null ? '--' : scope.row.srcValue}}
        </template>
      </el-table-column>
      <el-table-column label="修改值" prop="auditValue">
        <template slot-scope="scope">
          {{scope.row.auditValue === null ? '--' : scope.row.auditValue}}
        </template>
      </el-table-column>      
      <el-table-column label="描述" prop="reason"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUrlParams } from '../js/utils.js'
export default {
  name: "AuditLog",
  data() {
    return {
      logData: [],
      api: window.API,
      loading: false
    }
  },
  mounted() {
    // 获取url 上所有参数
    const urlObj = getUrlParams(self.location.href);
    console.log(Object.keys(urlObj));
    if(Object.keys(urlObj).length == 0) {
      return 
    }
    this.loading = true
    this.$axios({
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      data: JSON.stringify({
        dimension: 'h',
        endTime: `${this._decodeURIComponent(urlObj.time)}:00`,
        startTime: `${this._decodeURIComponent(urlObj.time)}:00`,
        enviromentCode: '1',
        pointIds: urlObj.pointId.split(','),
        pollutantCodes: urlObj.pollutantCode.split(','),
        operationTypes: [],
        pageNo: 1,
        pageSize: 30,
        userIds: []
      }), 
      url: `${this.api}/act/auditFlagLog4NoPage`
    }).then(res=> {
      console.log(res);
      this.logData = res.data.data;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    })
  },
  methods: {
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    }
  }
}
</script>

<style lang="scss" scoped>
.auditlog {
  height: 100%;
}
.el-table {
 height: 100%;
}
</style>