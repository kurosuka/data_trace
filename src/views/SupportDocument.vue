<!--
 * @Author: your name
 * @Date: 2021-03-29 15:48:46
 * @LastEditTime: 2021-03-29 16:10:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\Support.vue
-->
<template>
  <div class="support-document" v-loading="loading">
    <el-table :data="logData" height="calc(100%)">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="数据日期" prop="dataTime"></el-table-column>
      <el-table-column label="审核人" prop="userName"></el-table-column>
      <el-table-column label="测点" prop="pointName"></el-table-column>
      <el-table-column label="类型" prop="opTypeEnum"></el-table-column>
      <el-table-column label="因子" prop="pollutantName"></el-table-column>
      <el-table-column label="原始值" prop="srcValue"></el-table-column>
      <el-table-column label="修改值" prop="auditValue"></el-table-column>
      <el-table-column label="审核理由" prop="reason"></el-table-column>
      <el-table-column label="审核日期" prop="opTime"></el-table-column>
      <!-- <el-table-column label="描述" prop="description"></el-table-column> -->
      <el-table-column label="附件" prop="attachment" align="center" header-align="center">
        <template slot-scope="scope">
          <el-link
            target="_blank"
            type="primary"
            v-for="(item, index) in scope.row.attachment"
            :key="index"
            :href="item"
          >文件{{index+1}}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUrlParams } from '../js/utils.js'
export default {
  name: "SupportDocument",
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
      url: `${this.api}/act/auditFlagLog`
    }).then(res=> {
      console.log(res);
      this.logData = res.data.data.tableContent.filter(item=>{
        return Object.prototype.hasOwnProperty.call(item, 'attachment')
      });
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
.support-document {
  height: 100%;
}
.el-table {
 height: 100%;
}
</style>