<!--
 * @Author: your name
 * @Date: 2021-05-06 13:19:55
 * @LastEditTime: 2021-05-10 17:36:55
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
            <multi-select :selectData="pointList" :defaultProps="{children: 'children', label: 'title'}" :multiType="true" :defaultData="defaultData" @changeData="selectPoint"></multi-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="headerForm.start" type="datetime" placeholder="请选择数据开始时间" value-format="yyyy-MM-dd HH:00:00" :clearable="false" :editable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="headerForm.end" type="datetime" placeholder="请选择数据结束时间" value-format="yyyy-MM-dd HH:00:00" :clearable="false" :editable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="匹配情况">
            <el-select v-model="headerForm.match" placeholder="请选择">
              <el-option v-for="item in matchList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监测因子">
            <el-select v-model="headerForm.factor" placeholder="请选择">
              <el-option v-for="item in factorList" :key="item.factorCode" :label="item.factorName" :value="item.factorCode"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="searchClick">查询</el-button>
        </el-form>
      </el-header>
      <el-main>
        <el-table :data="keyList" stripe v-loading="loading" height="calc(100% - 45px)">
          <el-table-column label="No." width="80px">
            <template slot-scope="scope">
              {{_index(scope.$index)}}
            </template>
          </el-table-column>
          <el-table-column label="点位名称" prop="snName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="数据时间" prop="timeOrigin" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="监测因子" prop="code">
            <template slot-scope="scope">
              {{_factorName(scope.row.code)}}
            </template>
          </el-table-column>
          <el-table-column label="仪器状态参数" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-link type="primary" @click="keyClick(scope.row)">详情</el-link>
            </template>
          </el-table-column>
          <el-table-column label="仪器日志" prop="processLog">
            <template slot-scope="scope">
              <el-link type="primary" @click="yqClick(scope.row, '仪器日志')">详情</el-link>
            </template>
          </el-table-column>
          <el-table-column label="流程日志" prop="processLog">
            <template slot-scope="scope">
              <el-link type="primary" @click="yqClick(scope.row, '流程日志')">详情</el-link>
            </template>
          </el-table-column>
          <el-table-column label="匹配结果" prop="status">
            <template slot-scope="scope">
              <span :style="{'color': scope.row.status == 1 ? '' : '#ff0000'}">{{_matchResult(scope.row.status)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.page"
        :page-sizes="pages.sizes"
        :page-size="pages.rows"
        style="float:right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
      ></el-pagination>
      </el-main>
    </el-container>
    <!--关键参数兴详情-->
    <el-dialog title="关键参数详情" :visible.sync="keyVisible" v-draggable :close-on-click-modal="false" v-if="keyVisible" height="400px">
      <key-table :keyTable="keyData"></key-table>
    </el-dialog>
    <!--仪器日志-->
    <el-dialog :title="yqTitle" :visible.sync="yqVisible" v-draggable :close-on-click-modal="false" v-if="yqVisible" height="400px">
      <el-table :data="logData" v-loading="yqLoading" max-height="400px">
        <el-table-column label="监测时间" prop="time"></el-table-column>
        <el-table-column label="日志" :prop="yqTitle == '仪器日志' ? 'i11001' : 'i21001'"></el-table-column>
      </el-table>
    </el-dialog>
    <!--流程日志-->
  </div>
</template>

<script>
import KeyTable from '../../components/KeyTable.vue';
import MultiSelect from '../../components/MultiSelect.vue'
import { getPoints, getFactors, queryParam, queryParamByPointFactor,
queryParamMatch, queryParamProcessLog } from './request.js';
import axios from 'axios';

const moment = require('moment');
export default {
  components: { MultiSelect, KeyTable },
  name: 'KeyParamseter',
  data() {
    return {
      headerForm: { // 头部查询参数
        start: moment(new Date()).subtract(3,'day').format('YYYY-MM-DD HH:00:00'),
        end: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
        match: null,
        factor: ''
      },
      keyList: [], // 表格列表
      keyVisible: false,
      yqLoading: true,
      pointList: [],
      matchList: [
        {
          label: '全部',
          value: null,
        },
        {
          label: '匹配',
          value: 1,
        },
        {
          label: '不匹配',
          value: 0,
        }
      ],
      yqVisible: false,
      yqTitle: '',
      logData: [],
      factorList: [],
      defaultData: [],
      loading: true,
      pages: {
        page: 1,
        rows: 30,
        sort: 'time-',
        total: 0,
        sizes: [20, 30, 40]
      },
      selectPointList: [],
      keyData: [], // 状态参数详情
    }
  },
  created() {
    this.init().then(res=> {
      const option = {
        fromTime: this.headerForm.start,
        toTime: this.headerForm.end,
        factorCode: this.headerForm.factor,
        qualified: null,
        fields: [
          {
            "field":"status"
          },
          {
            "field":"code"
          }
        ],
        sns: res.map((item, index)=> {
          return {
            sn: /* index */item.id,
            snName: item.title,
            orderNum: (this.selectPointList.length - index),
          }
        })
      };
      console.log(option);
      this.getKeyList(option);
    });
  },
  methods: {
    async init() {
      await axios.all([getPoints(), getFactors()]).then(
          axios.spread((res1, res2)=> {
            this.pointList = res1.data.data;
            this.factorList = res2.data.data;
            this.headerForm.factor = this.factorList[0].factorCode;
            this.defaultData = this._flatter(res1.data.data).map(item => item.id); // 默认点位
            this.selectPointList = this._flatter(res1.data.data); // 默认点位
            console.log(this.defaultData);
          })
        );
      return new Promise((resolve, reject)=> {
        console.log(this.defaultData);
        resolve(this.selectPointList);
        reject();
      })
    },
    searchClick() {
      this.pages.page = 1;
      this.search();
    },
    // 查询
    search() {
      const option = {
        fromTime: this.headerForm.start,
        toTime: this.headerForm.end,
        factorCode: this.headerForm.factor,
        qualified: this.headerForm.match,
        fields: [
          {
              "field": "status"
          },
          {
            'field': 'code'
          }
        ],
        sns: this.selectPointList.map((item, index)=> {
          return {
            sn: /* (1+index), */item.id,
            snName: item.title,
            orderNum: (this.selectPointList.length - index),
          }
        })
      };
      this.getKeyList(option)
    },
    keyClick(data) {
      console.log(data);
      this.getParamByPointFactor({
        pointId: data.sn,
        factorCode: this.headerForm.factor,
      }, data);
    },
    getKeyList(data) {
      queryParam(data, {
        page: this.pages.page,
        rows: this.pages.rows,
        sort: this.pages.sort
      }).then(res=> {
        this.keyList = res.data.data;
        this.pages.total = res.data.count;
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 500);
        if(res.data.code == 500) {
          this.$message.warning({
            message: res.data.msg,
            showClose: true,
          })
        }
      })
        .catch(err=> {
          this.$message.warning({
            message: err,
            showClose: true
          })
      })
    },
    getParamByPointFactor(params, row) {
      // 关键参数
      queryParamByPointFactor(params).then(res=> {
        if(!res.data.data) {
          this.$message.warning({
            showClose: true,
            message: '无仪器状态参数'
          })
          return
        }
        this.keyVisible = true;
        this.keyData = res.data.data;
        const opt = {
          tstamp: row.time,
          factorCode: this.headerForm.factor,
          fields: [...this.keyData.map((item)=> {
            return {
              field: item.paramCode
            }
          }),{field: 'status'}],
          snCriteria: 
            {
              sn: row.sn,
              snName: row.snName,
              orderNum: 9999
            }
        }
        queryParamMatch(opt).then(res=> {
          const MatchData = res.data.data;
          this.keyData = this.keyData.map(item=> {
            item.v = MatchData[item.paramCode] == null ? '--' : MatchData[item.paramCode];
            item.status = MatchData[`${item.paramCode}_status`];
            return item;
          })
        })
      })
      // 匹配情况
      
    },
    // 仪器日志点击
    yqClick(row, title) {
      this.yqTitle = title;
      this.yqVisible = true;
      console.log(row);
      let params = title === '仪器日志' ? 'i11001' : 'i21001';
      this.getParamProcessLog(row, params);
    },
    getParamProcessLog(row, params) {
      queryParamProcessLog(
        {
        fromTime: row.time,
        toTime: moment(row.time).add(3, 'hours').format('yyyy-MM-DD HH:59:59'),
        factorCode: this.headerForm.factor,
        snCriteria: {
          orderNum: 9999,
          sn: /* 1 */row.sn,
          snName: row.snName
        },
        fields: [
          {
            "field": params,
        },
        ]
      }
      ).then(res => {
        console.log(res);
         this.yqLoading = true;
        this.logData = res.data.data;
        setTimeout(() => {
          this.yqLoading = false;
        }, 500);
      })
    },
    /**
     * @description 获取选中的点位
     */
    selectPoint(data) {
      console.log(data);
      this.selectPointList = data;
    },
    _factorName(code) {
      console.log(code);
      //return this.factorList.filter(item=> {return item.factorCode == code})[0]._factorName;
      return this.factorList.filter(item=> {
        return item.factorCode == code
      }).map(item=>item.factorName).join('');
    },
    // 表格索引
     _index(idx) {
      return (this.pages.page - 1) * this.pages.rows + (idx + 1)
    },
    // 匹配结果
    _matchResult(data) {
      return this.matchList.filter(item=>{
        return item.value == data
      }).map(item=>item.label).join('')
    },
    // 每页条数
    handleSizeChange(val) {
      console.log(val);
      this.pages.rows = val;
      this.pages.page = 1;
      this.search();
    },
    handleCurrentChange(val) {
      this.pages.page = val;
      this.search();
    },
    // 树数据扁平化
    _flatter(data) {
      let cloneData = JSON.parse(JSON.stringify(data))   //先将原来的数组深拷贝一份，防止影响到原来的数据
      let obj = [];
      var fn = (cloneData)=> {
        cloneData.map(item=> {
          if(item.children == null) {
            obj.push(item)
          } else {
            fn(item.children)
          }
        })
      }
      fn(cloneData);
      return obj
    },
  },
  computed: {
    gapDay() {
      return moment(this.headerForm.end).isAfter(this.headerForm.start)
    }
  },
  watch: {
    gapDay: {
      handler(newVal) {
        if(!newVal) {
          this.$message.warning({
            showClose: true,
            message: '开始时间不能大于结束时间'
          })
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
.key-paramseter {
  height: 100%;
  overflow: hidden;
}
.key-paramseter .el-header {
  margin-top: 15px;
}
.el-dialog__header {
  cursor: move;
}
.key-paramseter .el-container {
  height: 100%;
}
.key-paramseter .el-select .el-select__tags>span {
  display: flex;
  overflow: hidden;
}
.key-paramseter span.el-tag {
  display: block;
}
.key-paramseter .el-pagination {
  margin-top: 10px;
}
.key-paramseter .el-header {
  height: auto !important;
}
</style>
