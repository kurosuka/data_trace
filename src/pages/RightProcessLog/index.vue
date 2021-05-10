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
    <el-table :data="tableData">
      <el-table-column label="监测时间"></el-table-column>
      <el-table-column label="日志"></el-table-column>
    </el-table>
    <el-pagination :total="pages.total" :page-size="pages.pageSize" :page-sizes="pages.pageSizes" :current-page="pages.current"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [], // 流程日志表格数据
      pages: {
        current: 1, // 当前页
        pageSize: 30, // 每页条数
        pageSizes: [10, 20, 30], // 页码选择
        total: 0, // 总页数
      }
    }
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
</style>