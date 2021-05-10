<template>
  <div id="app">
    <div class="table">
      <el-table id="out-table" :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="日期" prop="time" align="center" min-width="160px"></el-table-column>
        <!-- 高锰酸盐指数 -->
        <el-table-column
          v-if="_factorShow('w01019')"
          label="高锰酸盐指数(mg/L)"
          align="center"
          min-width="80px"
          height="30"
        >
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="light"
                :content="tip(scope.row,'高锰酸盐指数','srcDataValue','原始数据',true)"
                placement="right"
              >
                <div class="dataText">
                  <span>{{tableText(scope.row,'高锰酸盐指数','dataValue')}}&nbsp;</span>
                  <span style="font-weight: bolder">{{testData(scope.row,'高锰酸盐指数')}}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="跨度核查" align="center" min-width="80px" height="30">
            <el-table-column
              label="标准样浓度"
              prop="value"
              align="center"
              min-width="100px"
              height="30"
            >
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'高锰酸盐指数','standardValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'高锰酸盐指数','wcRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'高锰酸盐指数','wcQualified')}"
                >{{tableText(scope.row,'高锰酸盐指数','wcQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="tip(scope.row,'高锰酸盐指数','lastSrcDataValue','原始数据',false)"
                  placement="right"
                >
                  <el-button type="text">{{tableText(scope.row,'高锰酸盐指数','lastDataValue')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="跨度值" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'高锰酸盐指数','spanValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'高锰酸盐指数','zdRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'高锰酸盐指数','zdQualified')}"
                >{{tableText(scope.row,'高锰酸盐指数','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 氨氮 -->
        <el-table-column
          v-if="_factorShow('w21003')"
          label="氨氮(mg/L)"
          align="center"
          min-width="80px"
          height="30"
        >
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="light"
                :content="tip(scope.row,'氨氮','srcDataValue','原始数据',true)"
                placement="right"
              >
                <div class="dataText">
                  <span>{{tableText(scope.row,'氨氮','dataValue')}}&nbsp;</span>
                  <span style="font-weight: bolder">{{testData(scope.row,'氨氮')}}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="跨度核查" align="center" min-width="80px" height="30">
            <el-table-column
              label="标准样浓度"
              prop="value"
              align="center"
              min-width="100px"
              height="30"
            >
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'氨氮','standardValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'氨氮','wcRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'氨氮','wcQualified')}"
                >{{tableText(scope.row,'氨氮','wcQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="tip(scope.row,'氨氮','lastSrcDataValue','原始数据',false)"
                  placement="right"
                >
                  <el-button type="text">{{tableText(scope.row,'氨氮','lastDataValue')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="跨度值" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'氨氮','spanValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'氨氮','zdRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'氨氮','zdQualified')}"
                >{{tableText(scope.row,'氨氮','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总磷 -->
        <el-table-column
          v-if="_factorShow('w21011')"
          label="总磷(mg/L)"
          align="center"
          min-width="80px"
          height="30"
        >
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="light"
                :content="tip(scope.row,'总磷','srcDataValue','原始数据',true)"
                placement="right"
              >
                <div class="dataText">
                  <span>{{tableText(scope.row,'总磷','dataValue')}}&nbsp;</span>
                  <span style="font-weight: bolder">{{testData(scope.row,'总磷')}}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="跨度核查" align="center" min-width="80px" height="30">
            <el-table-column
              label="标准样浓度"
              prop="value"
              align="center"
              min-width="100px"
              height="30"
            >
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总磷','standardValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总磷','wcRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'总磷','wcQualified')}"
                >{{tableText(scope.row,'总磷','wcQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="tip(scope.row,'总磷','lastSrcDataValue','原始数据',false)"
                  placement="right"
                >
                  <el-button type="text">{{tableText(scope.row,'总磷','lastDataValue')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="跨度值" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总磷','spanValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总磷','zdRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'总磷','zdQualified')}"
                >{{tableText(scope.row,'总磷','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总氮 -->
        <el-table-column
          v-if="_factorShow('w21001')"
          label="总氮(mg/L)"
          align="center"
          min-width="80px"
          height="30"
        >
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="light"
                :content="tip(scope.row,'总氮','srcDataValue','原始数据',true)"
                placement="right"
              >
                <div class="dataText">
                  <span>{{tableText(scope.row,'总氮','dataValue')}}&nbsp;</span>
                  <span style="font-weight: bolder">{{testData(scope.row,'总氮')}}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="跨度核查" align="center" min-width="80px" height="30">
            <el-table-column
              label="标准样浓度"
              prop="value"
              align="center"
              min-width="100px"
              height="30"
            >
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总氮','standardValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总氮','wcRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'总氮','wcQualified')}"
                >{{tableText(scope.row,'总氮','wcQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="tip(scope.row,'总氮','lastSrcDataValue','原始数据',false)"
                  placement="right"
                >
                  <el-button type="text">{{tableText(scope.row,'总氮','lastDataValue')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="跨度值" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总氮','spanValue')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="相对误差" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总氮','zdRate')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="合格情况" prop="value" align="center" min-width="80px" height="30">
              <template slot-scope="scope">
                <span
                  :class="{no:color(scope.row,'总氮','zdQualified')}"
                >{{tableText(scope.row,'总氮','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { exportExcel } from '../../js/tools'
export default {
  data: function() {
    return {
      tableList: [],
      loading: true,
      factor: ["w01019", "w21003", "w21011", "w21001"],
      paramValue: {},
      btnColor: false,
      baseUrl: window.API
    };
  },
  mounted: function() {
    this.getValue();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    // 获取外部数据
    getValue() {
      window.addEventListener("message", eve => {
        let data = eve.data;
        if (data.params !== undefined) {
          if(data.params.isExport){
            exportExcel("out-table", "跨度数据"); // 导出
          }else{
            this.loading = true;
            this.factor = data.params.factorList;
            this.paramValue["dtFrom"] = data.params.strTime;
            this.paramValue["dtTo"] = data.params.endTime;
            this.paramValue["pointId"] = data.params.pointId;
            this.getTableList();
          }
        }
      });
    },
    // 获取表格数据
    getTableList() {
      console.log(this.paramValue);
      let url = this.baseUrl + "/quality/spanDrift";
      let param = this.paramValue;
      this.$axios.post(url, param).then(res => {
        if (res.status == 200) {
          if (res.data.code == 200) {
            if (res.data.data === null) {
              this.loading = false;
              return false;
            }
            let obj = res.data.data.filter(item => {
              return this.factor.includes(item.codeId);
            });
            this.tableList = this._dataHandle(obj);
            setTimeout(() => {
              this.loading = false;
            }, 500);
          }
        }
      });
    },
    // 数据处理
    _dataHandle(obj) {
      let time = [];
      let vList = [];
      obj.map(item => {
        time.push(item.dataTime);
      });
      let _time = Array.from(new Set(time));
      let cTime = _time.slice(0).sort((a, b) => (b < a ? -1 : 1));
      cTime.map(item => {
        let valueList = {};
        let factorList = [];
        valueList["time"] = item;
        this.factor.map(list => {
          factorList.push(
            obj.filter(group => {
              return group.dataTime == item && group.codeId == list;
            })
          );
        });
        valueList["value"] = factorList.flat();
        vList.push(valueList);
      });
      console.log(vList);
      return vList;
    },
    // 动态展示因子数据
    _factorShow(val) {
      let isOn = this.factor.includes(val);
      return isOn;
    },
    // 动态生成内容
    tableText(val, name, key) {
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "--";
      } else {
        if (text[0][key] === null) {
          return "--";
        } else {
          return text[0][key];
        }
      }
    },
    // 测试结果添加标记位
    testData(val, name) {
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return " ";
      } else {
        if (text[0].flag === null) {
          return " ";
        } else {
          return text[0].flag;
        }
      }
    },
    // 更改不合格颜色
    color(val, name, key) {
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "";
      } else {
        if (text[0][key] === null) {
          return "";
        } else {
          return text[0][key] == "不合格" ? true : false;
        }
      }
    },
    // 合格提示
    tip(val, name, key, tips, isShow) {
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "--";
      } else {
        if (text[0][key] === null && text[0].flag === null) {
          return "--";
        } else {
          if (isShow) {
            if (text[0][key] === null && text[0].flag !== null) {
              return "标记位:" + text[0].flagName;
            } else if (text[0][key] !== null && text[0].flag === null) {
              return tips + ":" + text[0][key];
            } else {
              return tips + ":" + text[0][key] + "; 标记位:" + text[0].flagName;
            }
          } else {
            return tips + ":" + text[0][key];
          }
        }
      }
    }
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
#app {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
.table {
  /* margin: 10px 20px 0 20px; */
  flex: 1;
}
.el-button--text {
  color: #606266 !important;
}
.dataText {
  cursor: pointer;
}
.no {
  color: #f00 !important;
}
</style>