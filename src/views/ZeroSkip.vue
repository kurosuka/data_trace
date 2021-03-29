<!--
 * @Author: your name
 * @Date: 2021-03-22 09:35:07
 * @LastEditTime: 2021-03-29 16:56:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\zeroSkip\zeroSkip.vue
-->
<template>
  <div class="zero-skip">
    <!--测试结果详情-->
      <div class="navlist" v-if="false">
        <div>测试值：<span>{{testValue}}</span></div>
        <div>测试时间：<span>{{testTime}}</span></div>
        <div>分析方法：<span>{{testFn}}</span></div>
      </div>
    <div class="table">
      <!--零点数据-->
    <el-table :data="zeroData" :border="true">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="日期"  width="150px" prop="dataTime" align="center" :show-overflow-tooltip="true" :resizable="true"></el-table-column>
      <el-table-column label="测试结果" prop="dataValue" align="center"></el-table-column>
      <el-table-column label="零点核查" align="center" prop="">
        <el-table-column label="标准样浓度" align="center" prop="standardValue"></el-table-column>
        <el-table-column label="绝对误差" align="center" prop="wcRate"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="wcQualified"></el-table-column>
      </el-table-column>
      <el-table-column label="24小时零点漂移" align="center" prop="drift">
        <el-table-column label="前一次测试结果" align="center" prop="lastDataValue"></el-table-column>
        <el-table-column label="跨度值" align="center" prop="spanValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="zdRate"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="zdQualified"></el-table-column>
      </el-table-column>
    </el-table>
    <!--跨度数据-->
    <el-table :data="spanData" class="skip" :border="true">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="日期" prop="dataTime" width="150px" align="center" :show-overflow-tooltip="true" :resizable="true"></el-table-column>
      <el-table-column label="测试结果" prop="dataValue" align="center"></el-table-column>
      <el-table-column label="跨度核查" align="center" prop="zeroCheck">
        <el-table-column label="标准样浓度" align="center" prop="standardValue"></el-table-column>
        <el-table-column label="绝对误差" align="center" prop="wcRate"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="wcQualified"></el-table-column>
      </el-table-column>
      <el-table-column label="24小时跨度漂移" align="center" prop="drift">
        <el-table-column label="前一次测试结果" align="center" prop="lastDataValue"></el-table-column>
        <el-table-column label="跨度值" align="center" prop="spanValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="zdRate"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="zdQualified"></el-table-column>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import { getUrlParams } from '../js/utils'
var moment = require('moment');
export default {
  name: 'ZeroSkip',
  data() {
    return {
      testValue: '0.35',
      testTime: '2020-03-01 00:00:00',
      testFn: '高锰酸盐氧化-ORP电位滴定法',
      zeroData: [  // 零点数据
        {
          time: '2020-03-01 11:00:00',
          currentResult: '0.35',
          zeroCheck: { // 零点核查
            standard: '0',
            absError: '0.35',
            qualification: '合格'
          },
          drift: { // 24小时漂移
            prevResult: '0.66',
            skipValue: '0.33',
            relativeValue: '-2.0%',
            qualification: '合格'
          }
        }
      ], 
      spanData: [ // 跨度数据
        {
          time: '2020-03-01 11:00:00',
          currentResult: '0.35',
          zeroCheck: { // 零点核查
            standard: '0',
            absError: '0.35',
            qualification: '合格'
          },
          drift: { // 24小时漂移
            prevResult: '0.66',
            skipValue: '0.33',
            relativeValue: '-2.0%',
            qualification: '合格'
          }
        }
      ],
      options: {},
    }
  },
  mounted() {
    this.options = getUrlParams(self.location.href);
    console.log(this.options);
    this.getZeroData();
    this.getSpanData();
  },
  methods: {
    // 获取零点数据
    getZeroData() {
      this.$axios({
        method: 'post',
        url: 'http://192.168.90.8:8081/api/quality/zeroDrift',
        headers: {'content-type': 'application/json;charset=UTF-8'},
        data: {
          codeIds: [this._decodeURIComponent(this.options.pollutantCode)],
          dtFrom: moment(this._decodeURIComponent(this.options.time).slice(0, 11) + '00').subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
          dtTo: moment(this._decodeURIComponent(this.options.time).slice(0, 11) + "23").add(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
          pointId: this._decodeURIComponent(this.options.pointId),
        }
      }).then(res=> {
        console.log(res);
        this.zeroData = res.data.data;
      })
    },
    // 获取跨度数据
    getSpanData() {
      this.$axios({
        method: 'post',
        url: 'http://192.168.90.8:8081/api/quality/spanDrift',
        headers: {'content-type': 'application/json;charset=UTF-8'},
        data: {
          codeIds: [this._decodeURIComponent(this.options.pollutantCode)],
          dtFrom: moment(this._decodeURIComponent(this.options.time).slice(0, 11) + '00').subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
          dtTo: moment(this._decodeURIComponent(this.options.time).slice(0, 11) + "23").add(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
          pointId: this._decodeURIComponent(this.options.pointId),
        }
      }).then(res=> {
        console.log(res);
        this.spanData = res.data.data;
      })
    },
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    }
  }
}
</script>

<style lang="scss" scoped>
  .zero-skip {
    position: relative;
    overflow: auto;
    .table {
      .skip {
        margin-top: 30px;
      }
    }
  }
  .navlist {
    background: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    font-size: 12px;
    color: #666;
    div {
      margin-right: 18px;
    }
    span {
      margin-left: 18px;
      display: inline-block;
    };
  }
</style>