<!--
 * @Author: your name
 * @Date: 2021-04-08 09:36:08
 * @LastEditTime: 2021-04-16 14:11:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\HistoryData.vue
-->
<template>
  <div class="historyData">
    <!--查询-->
    <nav>
      <el-form :model="form" inline>
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
    </nav>
    <div class="container" ref="container" v-loading="loading">
      <div class="left">
        <el-table :data="tableData" :header-cell-style="{backgroundColor: '#F5F7FA'}" border height="calc(100%)">
          <el-table-column label="监测时间" prop="time" width="150px"></el-table-column>
          <el-table-column :label="this._decodeURIComponent(this.options.pollutantName)" prop="value"></el-table-column>
        </el-table>
      </div>
      <div class="right">
        <div id="charts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlParams } from '../js/utils.js'
import { getLineCharts } from '../pages/HistoryData/getLineCharts.js';
import { getHistoryData } from '../pages/HistoryData/request.js'
const moment = require('moment');
export default {
  name: 'HistoryData',
  data() {
    return {
      form: {
        startTime: '',
        endTime: ''
      },
      options: {}, // url上带的参数
      tableData: [
        {
          id: 1,
          value: '0.22',
          time: '2021-02-04 00:00:00',
          hold: true
        },
        {
          id: 2,
          value: '0.22',
          time: '2021-02-04 01:00:00',
          hold: true
        },
        {
          id: 3,
          value: '0.22',
          time: '2021-02-04 02:00:00',
          hold: true
        },
        {
          id: 4,
          value: '0.22',
          time: '2021-02-04 03:00:00',
          hold: true
        },
        {
          id: 5,
          value: '0.22',
          time: '2021-02-04 04:00:00'
        },
        {
          id: 6,
          value: '0.12',
          time: '2021-02-04 05:00:00',
          hold: true
        },
        {
          id: 7,
          value: '0.22',
          time: '2021-02-04 06:00:00',
          hold: false
        },
        {
          id: 8,
          value: '0.22',
          time: '2021-02-04 07:00:00',
          hold: true
        },
        {
          id: 9,
          value: '0.082',
          time: '2021-02-04 08:00:00',
          hold: false
        },
        {
          id: 10,
          value: '0.022',
          time: '2021-02-04 09:00:00'
        },
        {
          id: 11,
          value: '0.222',
          time: '2021-02-04 10:00:00',
          hold: true
        },
        {
          id: 12,
          value: '3.422',
          time: '2021-02-04 11:00:00',
          hold: true
        }
      ],
      loading: false, // 数据加载控制
    }
  },
  mounted() {
    const right = document.querySelector('.right');
    console.log(this.$refs.container.style.height);
    
    const charts = document.getElementById('charts');
    const container = document.querySelector('.container')
    this.startTime = moment()
    this.options = getUrlParams(self.location.href);
    this.form.startTime = moment((this.options.time).slice(0,10)).subtract(13, 'd').format('YYYY-MM-DD');
    this.form.endTime = moment((this.options.time).slice(0,10)).add(1, 'd').format('YYYY-MM-DD');
    // 获取有效数据
    /* const holdData = this.tableData.filter(item=> {
      return item.hold == true
    }) */
    setTimeout(() => {
      charts.style.width =  right.offsetWidth + 'px';
      charts.style.height = container.offsetHeight + 'px'; 
      const lineCharts = this.$echarts.init(charts);
      getLineCharts([this.tableData, this.tableData], lineCharts)
    }, 0);
    getHistoryData({enviromentCode: 1}).then(res=> {
      console.log(res);
      this.loading = false;
    }).catch(err=> {
      console.log(err);
    })
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
.historyData {
  height: 100%;
}
.container {
  height: calc(100% - 50px);
  display: flex;
  overflow: hidden;
  .left {
    width: 250px;
    margin-right: 10px;
  }
  .right {
    flex: 1;
    height: 100%;
    clear: both;
  }
}
</style>