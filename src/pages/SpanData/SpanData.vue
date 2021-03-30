<template>
  <div id="spanData">
    <div class="table">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="日期" prop="time" align="center" min-width="150px"></el-table-column>
        <!-- 高锰酸盐指数 -->
        <el-table-column v-if="factor1" label="高锰酸盐指数(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="tip(scope.row,'高锰酸盐指数','srcDataValue','原始数据')" placement="right">
                <el-button type="text">{{tableText(scope.row,'高锰酸盐指数','dataValue')}}</el-button>
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'高锰酸盐指数','wcRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'高锰酸盐指数','wcQualified')}" type="text">{{tableText(scope.row,'高锰酸盐指数','wcQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'高锰酸盐指数','lastSrcDataValue','原始数据')" placement="right">
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'高锰酸盐指数','zdRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'高锰酸盐指数','zdQualified')}" type="text">{{tableText(scope.row,'高锰酸盐指数','zdQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 氨氮 -->
        <el-table-column v-if="factor2" label="氨氮(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="tip(scope.row,'氨氮','srcDataValue','原始数据')" placement="right">
                <el-button type="text">{{tableText(scope.row,'氨氮','dataValue')}}</el-button>
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'氨氮','wcRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'氨氮','wcQualified')}" type="text">{{tableText(scope.row,'氨氮','wcQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'氨氮','lastSrcDataValue','原始数据')" placement="right">
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'氨氮','zdRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'氨氮','zdQualified')}" type="text">{{tableText(scope.row,'氨氮','zdQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总磷 -->
        <el-table-column v-if="factor3" label="总磷(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="tip(scope.row,'总磷','srcDataValue','原始数据')" placement="right">
                <el-button type="text">{{tableText(scope.row,'总磷','dataValue')}}</el-button>
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'总磷','wcRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'总磷','wcQualified')}" type="text">{{tableText(scope.row,'总磷','wcQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'总磷','lastSrcDataValue','原始数据')" placement="right">
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'总磷','zdRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'总磷','zdQualified')}" type="text">{{tableText(scope.row,'总磷','zdQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总氮 -->
        <el-table-column v-if="factor4" label="总氮(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="tip(scope.row,'总氮','srcDataValue','原始数据')" placement="right">
                <el-button type="text">{{tableText(scope.row,'总氮','dataValue')}}</el-button>
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'总磷','wcRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'总氮','wcQualified')}" type="text">{{tableText(scope.row,'总氮','wcQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时跨度漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'总氮','lastSrcDataValue','原始数据')" placement="right">
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
                <el-tooltip class="item" effect="light" :content="tip(scope.row,'总磷','zdRegion','合格范围')" placement="right">
                  <el-button :class="{no:color(scope.row,'总氮','zdQualified')}" type="text">{{tableText(scope.row,'总氮','zdQualified')}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      tableList: [],
      loading: true,
      factor: [],
      paramValue: {},
      factor1: true,
      factor2: true,
      factor3: true,
      factor4: true,
      btnColor: false,
      baseUrl: "http://192.168.90.8:8081"
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
        this.loading = true;
        let data = eve.data;
        if (data.params !== undefined) {
          this.factor = data.params.factorList;
          if(this.factor.indexOf('w01019') == '-1'){
            this.factor1 = false;
          } else {
            this.factor1 = true;
          }
          if(this.factor.indexOf('w21003') == '-1'){
            this.factor2 = false;
          } else {
            this.factor2 = true;
          }
          if(this.factor.indexOf('w21011') == '-1'){
            this.factor3 = false;
          } else {
            this.factor3 = true;
          }
          if(this.factor.indexOf('w21001') == '-1'){
            this.factor4 = false;
          } else {
            this.factor4 = true;
          }
          this.paramValue["dtFrom"] = data.params.strTime;
          this.paramValue["dtTo"] = data.params.endTime;
          this.paramValue["pointId"] = data.params.pointId;
          setTimeout(() => {
            this.getTableList();
          }, 100);
        }
      });
    },
    // 获取表格数据
    getTableList() {
      console.log(this.paramValue);
      let url = this.baseUrl + "/api/quality/spanDrift";
      // let param = {
      //   // dtFrom: "2019-10-13 02",
      //   // dtTo: "2019-10-26 02",
      //   // pointId: "26"
      //   dtFrom: "2019-11-23 02",
      //   dtTo: "2019-11-26 02",
      //   pointId: "78"
      // };
      let param = this.paramValue;
      this.$axios.post(url, param).then(res => {
        if (res.status == 200) {
          if (res.data.code == 200) {
            if(res.data.data === null){
              this.loading = false
              return false;
            }
            let obj = res.data.data;
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
            this.tableList = vList;
            setTimeout(() => {this.loading = false},500)
          }
        }
      });
    },
    // 动态生成内容
    tableText(val, name, key) {
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "--";
      } else {
        if(text[0][key] === null){
          return "--"
        } else {
          return text[0][key];
        }
      }
    },
    // 更改不合格颜色
    color(val, name, key){
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "";
      } else {
        if(text[0][key] === null){
          return ""
        } else {
          return text[0][key] == "不合格" ?  true : false;
        }
      }
    },
    // 合格提示
    tip(val, name, key, tips){
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "--";
      } else {
        if(text[0][key] === null){
          return "--"
        } else {
          return tips+":"+text[0][key];
        }
      }
    },
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
#spanData {
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
.no {
  color: #f00 !important;
}
</style>