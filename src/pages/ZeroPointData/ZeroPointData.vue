<template>
  <div id="zeroData">
    <div class="table">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="测点" prop="time" align="center" min-width="150px"></el-table-column>
        <el-table-column label="日期" prop="time" align="center" min-width="150px"></el-table-column>
        <!-- 高锰酸盐指数 -->
        <el-table-column label="高锰酸盐指数(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value[0].dataValue" align="center" width="80px"></el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
            <el-table-column label="标准样浓度" prop="value[0].standardValue" align="center" min-width="100px" height="30"></el-table-column>
            <el-table-column label="绝对误差" prop="value[0].wcRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[0].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value[0].lastDataValue" align="center" width="120px" height="30"></el-table-column>
            <el-table-column label="跨度值" prop="value[0].spanValue" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="相对误差" prop="value[0].zdRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[0].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 氨氮 -->
        <el-table-column label="氨氮(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value[1].dataValue" align="center" width="80px"></el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
            <el-table-column label="标准样浓度" prop="value[1].standardValue" align="center" min-width="100px" height="30"></el-table-column>
            <el-table-column label="绝对误差" prop="value[1].wcRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[1].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value[1].lastDataValue" align="center" width="120px" height="30"></el-table-column>
            <el-table-column label="跨度值" prop="value[1].spanValue" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="相对误差" prop="value[1].zdRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[1].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总磷 -->
        <el-table-column label="总磷(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value[2].dataValue" align="center" width="80px"></el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
            <el-table-column label="标准样浓度" prop="value[2].standardValue" align="center" min-width="100px" height="30"></el-table-column>
            <el-table-column label="绝对误差" prop="value[2].wcRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[2].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value[2].lastDataValue" align="center" width="120px" height="30"></el-table-column>
            <el-table-column label="跨度值" prop="value[2].spanValue" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="相对误差" prop="value[2].zdRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[2].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 总氮 -->
        <el-table-column label="总氮(mg/L)" align="center" min-width="80px" height="30">
          <el-table-column label="测试结果" prop="value[3].dataValue" align="center" width="80px"></el-table-column>
          <el-table-column label="零点核查" align="center" min-width="80px" height="30">
            <el-table-column label="标准样浓度" prop="value[3].standardValue" align="center" min-width="100px" height="30"></el-table-column>
            <el-table-column label="绝对误差" prop="value[3].wcRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[3].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
          </el-table-column>
          <el-table-column label="24小时零点漂移" align="center" min-width="80px" height="30">
            <el-table-column label="前一次测试结果" prop="value[3].lastDataValue" align="center" width="120px" height="30"></el-table-column>
            <el-table-column label="跨度值" prop="value[3].spanValue" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="相对误差" prop="value[3].zdRate" align="center" min-width="80px" height="30"></el-table-column>
            <el-table-column label="合格情况" prop="value[3].zdQualified" align="center" min-width="80px" height="30"></el-table-column>
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
      baseUrl: 'http://192.168.90.8:8081'
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
      }
      this.$axios.post(url,param).then(res => {
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
#zeroData {
  display:flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
.table{
  margin:10px 20px 0 20px;
  flex:1;
}
</style>