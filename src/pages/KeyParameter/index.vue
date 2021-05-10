<!--
 * @Author: your name
 * @Date: 2021-05-06 13:19:55
 * @LastEditTime: 2021-05-06 16:55:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\KeyParameter\index.vue
-->
<template>
  <div class="key-paramseter">
    <el-container>
      <el-header>
        <el-form :model="headerForm" :inline="true">
          <el-form-item label="点位名称">
            <multi-select></multi-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="headerForm.start" type="datetime" placeholder="请选择数据开始时间" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="headerForm.end" type="datetime" placeholder="请选择数据结束时间" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form>
      </el-header>
      <el-main>
        <el-table :data="keyList">
          <el-table-column label="点位名称" prop="pointName"></el-table-column>
          <el-table-column label="数据时间" prop="dateTime"></el-table-column>
          <el-table-column label="监测因子" prop="pollutCodeName"></el-table-column>
          <el-table-column label="仪器状态参数">
            <template slot-scope="scope">
              <el-link type="primary" @click="keyClick(scope.row)">详情</el-link>
            </template>
          </el-table-column>
          <el-table-column label="流程日志" prop="processLog"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog title="关键参数详情" :visible.sync="keyVisible" v-draggable :close-on-click-modal="false" v-if="keyVisible">
      <key-table></key-table>
    </el-dialog>
  </div>
</template>

<script>
import KeyTable from '../../components/KeyTable.vue';
import MultiSelect from '../../components/MultiSelect.vue'
import {getKeyTable} from './request.js'
export default {
  components: { MultiSelect, KeyTable },
  name: 'KeyParamseter',
  data() {
    return {
      headerForm: { // 头部查询参数
        start: '',
        end: ''
      },
      keyList: [{ // 表格列表
        id: 1,
        pointName: '正口',
        dateTime: '2021-04-01 11:00:00',
        pointId: '333',
        pollutCodeName: '氨氮',
        processLog: 'XXXXXXXXXXXXXXX'
      }],
      keyVisible: false
    }
  },
  methods: {
    search() {
      console.log(this.headerForm);
    },
    keyClick(data) {
      this.keyVisible = true;
      console.log(data);
      getKeyTable({}).then(res=> {
        console.log(res);
      })
    },
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
.key-paramseter .el-header {
  margin-top: 15px;
}
.el-dialog__header {
  cursor: move;
}
</style>