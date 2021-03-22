<!--
 * @Author: your name
 * @Date: 2021-03-22 09:35:07
 * @LastEditTime: 2021-03-22 14:11:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\zeroSkip\zeroSkip.vue
-->
<template>
  <div class="zero-skip">
    <!--测试结果详情-->
      <div class="navlist">
        <div>测试值：<span>{{testValue}}</span></div>
        <div>测试时间：<span>{{testTime}}</span></div>
        <div>分析方法：<span>{{testFn}}</span></div>
      </div>
    <div class="table">
      <!--零点数据-->
    <el-table :data="zeroData" :border="true">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="日期" prop="time" align="center" :show-overflow-tooltip="true" :resizable="true"></el-table-column>
      <el-table-column label="测试结果" prop="currentResult" align="center"></el-table-column>
      <el-table-column label="零点核查" align="center" prop="zeroCheck">
        <el-table-column label="标准样浓度" align="center" prop="zeroCheck.standard"></el-table-column>
        <el-table-column label="绝对误差" align="center" prop="zeroCheck.absError"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="zeroCheck.qualification"></el-table-column>
      </el-table-column>
      <el-table-column label="24小时零点漂移" align="center" prop="drift">
        <el-table-column label="前一次测试结果" align="center" prop="drift.prevResult"></el-table-column>
        <el-table-column label="跨度值" align="center" prop="drift.skipValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="drift.relativeValue"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="drift.qualification"></el-table-column>
      </el-table-column>
    </el-table>
    <!--跨度数据-->
    <el-table :data="skipData" class="skip" :border="true">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="日期" prop="time" align="center" :show-overflow-tooltip="true" :resizable="true"></el-table-column>
      <el-table-column label="测试结果" prop="currentResult" align="center"></el-table-column>
      <el-table-column label="跨度核查" align="center" prop="zeroCheck">
        <el-table-column label="标准样浓度" align="center" prop="zeroCheck.standard"></el-table-column>
        <el-table-column label="绝对误差" align="center" prop="zeroCheck.absError"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="zeroCheck.qualification"></el-table-column>
      </el-table-column>
      <el-table-column label="24小时跨度漂移" align="center" prop="drift">
        <el-table-column label="前一次测试结果" align="center" prop="drift.prevResult"></el-table-column>
        <el-table-column label="跨度值" align="center" prop="drift.skipValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="drift.relativeValue"></el-table-column>
        <el-table-column label="合格情况" align="center" prop="drift.qualification"></el-table-column>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
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
      skipData: [ // 跨度数据
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .zero-skip {
    position: relative;
    .table {
      margin-top: 60px;
      .skip {
        margin-top: 30px;
      }
    }
  }
  .navlist {
    position: fixed;
    z-index: 999;
    background: #fff;
    width: 100%;
    top: 0;
    left: 0;
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