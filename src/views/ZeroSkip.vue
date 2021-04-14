<!--
 * @Author: your name
 * @Date: 2021-03-22 09:35:07
 * @LastEditTime: 2021-04-08 09:18:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\zeroSkip\zeroSkip.vue
-->
<template>
  <div class="zero-skip">
    <div class="table">
      <!--零点数据-->
    <el-table :data="zeroData" :border="true" :row-class-name="_tableRowClassName">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="日期"  width="150px" prop="dataTime" align="center" :show-overflow-tooltip="true" :resizable="true"></el-table-column>
      <el-table-column label="测试结果" prop="dataValue" align="center">
        <template slot-scope="scope">
          <div>
            <el-tooltip :content="scope.row.flagName" placement="right" :disabled="scope.row.flagName === null">
              <span>{{scope.row.dataValue === null ? '--' : scope.row.dataValue}} {{scope.row.flag}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="零点核查" align="center" prop="">
        <el-table-column label="标准样浓度" align="center" prop="standardValue"></el-table-column>
        <el-table-column label="绝对误差" align="center" prop="wcRate">
          <template slot-scope="scope">
            {{scope.row.wcRate !== null ? scope.row.wcRate : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="合格情况" align="center" prop="wcQualified">
          <template slot-scope="scope">
            <span :class="{red : _isRed(scope.row.wcQualified)}">{{scope.row.wcQualified}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="24小时零点漂移" align="center" prop="drift">
        <el-table-column label="前一次测试结果" align="center" prop="lastDataValue">
          <template slot-scope="scope">
          <div>
            <el-tooltip :content="scope.row.lastFlagName" placement="right" :disabled="scope.row.lastFlagName === null">
              <span>{{scope.row.lastDataValue === null ? '--' : scope.row.lastDataValue}} {{scope.row.lastFlag}}</span>
            </el-tooltip>
          </div>
        </template>
        </el-table-column>
        <el-table-column label="跨度值" align="center" prop="spanValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="zdRate">
          <template slot-scope="scope">
            {{scope.row.zdRate !== null ? scope.row.zdRate : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="合格情况" align="center" prop="zdQualified">
          <template slot-scope="scope">
            <span :class="{red : _isRed(scope.row.zdQualified)}">{{scope.row.zdQualified}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!--跨度数据-->
    <el-table :data="spanData" class="skip" :border="true" :row-class-name="_tableRowClassName">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="日期" prop="dataTime" width="150px" align="center" :show-overflow-tooltip="true" :resizable="true"></el-table-column>
      <el-table-column label="测试结果" prop="dataValue" align="center">
        <template slot-scope="scope">
          <div>
            <el-tooltip :content="scope.row.flagName" placement="right" :disabled="scope.row.flagName === null">
              <span>{{scope.row.dataValue === null ? '--' : scope.row.dataValue}} {{scope.row.flag}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="跨度核查" align="center" prop="zeroCheck">
        <el-table-column label="标准样浓度" align="center" prop="standardValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="wcRate">
          <template slot-scope="scope">
            {{scope.row.wcRate !== null ? scope.row.wcRate : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="合格情况" align="center" prop="wcQualified">
          <template slot-scope="scope">
            <span :class="{red : _isRed(scope.row.wcQualified)}">{{scope.row.wcQualified}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="24小时跨度漂移" align="center" prop="drift">
        <el-table-column label="前一次测试结果" align="center" prop="lastDataValue">
            <template slot-scope="scope">
            <div>
              <el-tooltip :content="scope.row.lastFlagName" placement="right" :disabled="scope.row.lastFlagName === null">
                <span>{{scope.row.lastDataValue === null ? '--' : scope.row.lastDataValue}} {{scope.row.lastFlag}}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="跨度值" align="center" prop="spanValue"></el-table-column>
        <el-table-column label="相对误差" align="center" prop="zdRate">
          <template slot-scope="scope">
            {{scope.row.zdRate !== null ? scope.row.zdRate : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="合格情况" align="center" prop="zdQualified">
          <template slot-scope="scope">
            <span :class="{red : _isRed(scope.row.zdQualified)}">{{scope.row.zdQualified}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import { getUrlParams } from '../js/utils';
import '../scss/globel.scss';
var moment = require('moment');
export default {
  name: 'ZeroSkip',
  data() {
    return {
      testValue: '0.35',
      testTime: '2020-03-01 00:00:00',
      testFn: '高锰酸盐氧化-ORP电位滴定法',
      flag: '', // 测试值标记位
      flagName: null, // 标记位中文含义
      zeroData: [  // 零点数据
      ], 
      spanData: [ // 跨度数据
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
        url: `${window.API}/quality/zeroDrift`,
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
        const topData = this.zeroData ? this.zeroData.filter(item=> {
          return item.dataTime.includes(this.options.time.slice(0,10))
        }) : [];
        console.log(topData);
        this.testTime = topData.length ? topData[0].dataTime : '--';
        this.testValue = topData.length ? topData[0].dataValue : '--';
        this.flag = topData.length ? topData[0].flag : '';
        this.flagName = topData.length ? topData[0].flagName : '';
      })
    },
    // 给定行颜色
    _tableRowClassName({row, rowIndex}) {
      console.log(rowIndex);
      if(row.dataTime.includes(this.options.time.slice(0,10))) {
        return 'fixed'
      } else {
        return ''
      }
    },
    // 获取跨度数据
    getSpanData() {
      this.$axios({
        method: 'post',
        url: `${window.API}/quality/spanDrift`,
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
        console.log(this.spanData);
      })
    },
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    },
    // 判断是否合格
    _isRed(data) {
      return data === '不合格' ? true : false
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
      margin-left: 10px;
      display: inline-block;
    }
  }
  .red {
      color: #ff0000;
  }
 .zero-skip /deep/.el-table tr.fixed {
    background-color: #f0f9eb;
  } 
</style>