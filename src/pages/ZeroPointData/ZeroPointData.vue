<template>
  <div id="spanData">
    <div class="table">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="测点" prop="time" align="center" min-width="150px"></el-table-column>
        <el-table-column label="日期" prop="time" align="center" min-width="150px"></el-table-column>
        <!-- 高锰酸盐指数 -->
        <el-table-column label="高锰酸盐指数(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{tableText(scope.row,'高锰酸盐指数','dataValue')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
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
                <span>{{tableText(scope.row,'高锰酸盐指数','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'高锰酸盐指数','lastDataValue')}}</span>
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
                <span>{{tableText(scope.row,'高锰酸盐指数','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 氨氮 -->
        <el-table-column label="氨氮(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{tableText(scope.row,'氨氮','dataValue')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
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
                <span>{{tableText(scope.row,'氨氮','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'氨氮','lastDataValue')}}</span>
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
                <span>{{tableText(scope.row,'氨氮','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总磷 -->
        <el-table-column label="总磷(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{tableText(scope.row,'总磷','dataValue')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
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
                <span>{{tableText(scope.row,'总磷','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总磷','lastDataValue')}}</span>
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
                <span>{{tableText(scope.row,'总磷','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总氮 -->
        <el-table-column label="总氮(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{tableText(scope.row,'总氮','dataValue')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
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
                <span>{{tableText(scope.row,'总氮','zdQualified')}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value" align="center" width="120px" height="30">
              <template slot-scope="scope">
                <span>{{tableText(scope.row,'总氮','lastDataValue')}}</span>
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
                <span>{{tableText(scope.row,'总氮','zdQualified')}}</span>
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
      loading: false,
      factor: ["w01019", "w21003", "w21011", "w21001"],
      baseUrl: "http://192.168.90.8:8081",
    };
  },
  mounted: function() {
    this.getTableList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    // 获取表格数据
    getTableList() {
      let url = this.baseUrl + "/api/quality/zeroDrift";
      let param = {
        dtFrom: "2019-10-13 02",
        dtTo: "2019-10-26 02",
        pointId: "26"
      };
      this.$axios.post(url, param).then(res => {
        if (res.status == 200) {
          let obj = res.data.data;
          console.log(obj);
          let time = [];
          let vList = [];
          obj.map(item => {
            time.push(item.dataTime);
          });
          let _time = Array.from(new Set(time));
          _time.map(item => {
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
          this.tableList = vList;
        }
      });
    },
    // 动态生成内容
    tableText(val, name, key) {
      let text = val.value.filter(item => item.paramName == name);
      if (text.length === 0) {
        return "--";
      } else {
        return text[0][key];
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
#spanData {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
.table {
  margin: 10px 20px 0 20px;
  flex: 1;
}
</style>