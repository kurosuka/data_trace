
<template>
  <div class="daily-quality">
    <el-container>
      <el-main>
        <!--搜索条件-->
        <div class="nav">
          <el-form :model="form" :inline="true">
            <el-form-item label="点位"
              >
              <el-select v-model="form.pointOption" placeholder="请选择" filterable>
                <el-option v-for="item in pointData" :key="item.pointId" :label="item.pointName" :value="item.pointId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="监测项目">
              <el-tooltip :content="selectTooltip" placement="top" :disabled="form.selectValue.length == 0">
                <el-select
                  v-model="form.selectValue"
                  placeholder="请选择"
                  :multiple="true"
                  :collapse-tags="true"
                >
                  <el-option
                    v-for="item in factorList"
                    :key="item.factorCode"
                    :label="item.factorName"
                    :value="item.factorCode"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getAuditTableData" v-preventReClick icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" @click="dialogToggle"
                >设置内容</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!--tab页切换-->
        <el-tabs type="card" v-model="tabsActive" v-loading="loading" @tab-click="tabClick">
          <el-tab-pane label="已审核">
            <el-table :data="tableData" size="middle">
              <el-table-column label="序号" type="index">
                <template slot-scope="scope">
                  <span>{{_index(scope.$index)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="点位名称"
                prop="pointName"
              ></el-table-column>
              <el-table-column
                label="监测项目"
                prop="factorName"
              ></el-table-column>
              <el-table-column
                label="跨度值"
                prop="spanValues"
              ></el-table-column>
              <el-table-column
                label="零点标准溶液浓度"
                prop="zeroStandard"
              ></el-table-column>
              <el-table-column
                label="跨度标准溶液浓度"
                prop="spanStandard"
              ></el-table-column>
              <el-table-column label="提交人" prop="submitterName"></el-table-column>
              <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="审核人" prop="reviewerName"></el-table-column>
              <el-table-column label="审核时间" prop="reviewTime" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link @click="historyClick(scope)">历史记录</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="未审核">
            <el-table :data="auditNottableData" size="middle">
              <el-table-column label="序号" type="index">
                <template slot-scope="scope">
                  <span>{{_index(scope.$index)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="点位名称"
                prop="pointName"
              ></el-table-column>
              <el-table-column
                label="监测项目"
                prop="factorName"
              ></el-table-column>
              <el-table-column
                label="跨度值"
                prop="spanValues"
              ></el-table-column>
              <el-table-column
                label="零点标准溶液浓度"
                prop="zeroStandard"
              ></el-table-column>
              <el-table-column
                label="跨度标准溶液浓度"
                prop="spanStandard"
              ></el-table-column>
              <el-table-column label="提交人" prop="submitterName"></el-table-column>
              <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="未通过">
            <el-table :data="rejectTableData" size="middle">
              <el-table-column label="序号" type="index">
                <template slot-scope="scope">
                  <span>{{_index(scope.$index)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="点位名称"
                prop="pointName"
              ></el-table-column>
              <el-table-column
                label="监测项目"
                prop="factorName"
              ></el-table-column>
              <el-table-column
                label="跨度值"
                prop="spanValues"
              ></el-table-column>
              <el-table-column
                label="零点标准溶液浓度"
                prop="zeroStandard"
              ></el-table-column>
              <el-table-column
                label="跨度标准溶液浓度"
                prop="spanStandard"
              ></el-table-column>
              <el-table-column label="提交人" prop="submitterName"></el-table-column>
              <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="审核人" prop="reviewerName"></el-table-column>
              <el-table-column label="审核时间" prop="reviewTime" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <!--设置标准值弹窗-->
    <el-dialog
      title="项目设置详情"
      :visible.sync="dialogVisble"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      v-if="dialogVisble"
      v-draggable
    >
      <el-table :data="dialogTableData" :border="true" size="small">
        <el-table-column
          label="监测项目"
          prop="title"
          align="center"
        ></el-table-column>
        <el-table-column label="高猛酸盐指数" prop="cod" align="center">
          <template slot-scope="scope">
            <el-input
              required
              v-model="dialogForm[scope.$index].cod"
              placeholder="请输入"
              v-if="scope.row.cod == 'input'"
            >
              <template slot="append">mg/L</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.cod == 'btn'"
               v-preventReClick
              @click="submitValue('cod','w01019')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.cod)"
              >{{ scope.row.cod }}mg/L</span
            >
          </template>
        </el-table-column>
        <el-table-column label="氨氮" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].an"
              placeholder="请输入"
              v-if="scope.row.an == 'input'"
            >
              <template slot="append">mg/L</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.an == 'btn'"
               v-preventReClick
              @click="submitValue('an', 'w21003')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.an)"
              >{{ scope.row.an }}mg/L</span
            >
          </template>
        </el-table-column>
        <el-table-column label="总磷" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].ph"
              placeholder="请输入"
              v-if="scope.row.ph == 'input'"
            >
              <template slot="append">mg/L</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.ph == 'btn'"
               v-preventReClick
              @click="submitValue('ph', 'w21011')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.ph)"
              >{{ scope.row.ph }}mg/L</span
            >
          </template>
        </el-table-column>
        <el-table-column label="总氮" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].nt"
              placeholder="请输入"
              v-if="scope.row.nt == 'input'"
            >
              <template slot="append">mg/L</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.nt == 'btn'"
               v-preventReClick
              @click="submitValue('nt', 'w21001')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.nt)"
              >{{ scope.row.nt }}mg/L</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--历史记录-->
    <el-dialog
      title="操作记录"
      :visible.sync="historyVisible"
      :close-on-click-modal="false"
      v-if="historyVisible"
      height="600px"
      v-draggable
    >
      <el-table :data="historyData" height="calc(500px - 80px)">
        <el-table-column label="序号" type="index">
          <template slot-scope="scope">
            <span>{{_index(scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="点位名称" prop="pointName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="监测项目" prop="factorName"></el-table-column>
        <el-table-column label="跨度值" prop="spanValues"></el-table-column>
        <el-table-column label="零点标准浓液浓度" prop="zeroStandard"></el-table-column>
        <el-table-column
          label="跨度标准浓液浓度"
          prop="spanStandard"
        ></el-table-column>
        <el-table-column label="提交人" prop="submitterName"></el-table-column>
        <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="审核人" prop="submitterName"></el-table-column>
        <el-table-column label="审核时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getLocalstorage, getUrlParams } from '../js/utils';
import '../scss/globel.scss'
export default {
  name: "StandardValueConfig",
  data() {
    return {
      loading: false,
      form: {                     // 表单数据
        selectValue: [],
        pointOption: ''
      },
      pointData: [],              // 点位数据
      factorList: [],             // 因子下拉数据
      tableData: [],              // 已审核数据
      sourceData: [],             // 原始数据
      auditNottableData: [],    // 未审核数据
      rejectTableData: [],        // 未通过的审核数据
      dialogTableData: [
        {
          title: "上一周水质平均值",
          cod: null, // 高锰酸盐指数
          an: null, // 氨氮
          ph: null, // 总磷
          nt: null, // 总氮
        },
        {
          title: "跨度值",
          cod: "input", // 高锰酸盐指数
          an: "input", // 氨氮
          ph: "input", // 总磷
          nt: "input", // 总氮
        },
        {
          title: "零点标准浓液浓度",
          cod: "input", // 高锰酸盐指数
          an: "input", // 氨氮
          ph: "input", // 总磷
          nt: "input", // 总氮
        },
        {
          title: "跨度标准浓液浓度",
          cod: "input", // 高锰酸盐指数
          an: "input", // 氨氮
          ph: "input", // 总磷
          nt: "input", // 总氮
        },
        {
          title: "",
          cod: "btn", // 高锰酸盐指数
          an: "btn", // 氨氮
          ph: "btn", // 总磷
          nt: "btn", // 总氮
        },
      ],
      dialogVisble: false, // 弹框是否显示
      dialogForm: [], // 新增绑定的值
      historyData: [], // 当前点位因子历史记录
      historyVisible: false, // 控制历史记录弹窗是否显示
      tabsActive: 0, // tab切换当前页
      historyPage: {
        currentPage: 1,
        pageSize: 20,
        total: 80
      },
      base: window.API // 接口api地址
    };
  },
  components: {
  },
  computed: {
    selectTooltip() {
      return this.factorList
        .filter((item) => {
          return this.form.selectValue.includes(item.factorCode);
        })
        .map((item) => {
          return item.factorName;
        })
        .join(",");
    },
  },
  mounted() {
    // 数据初始化
    this.$axios.all([this.getPoints(),this.getFactors()])
      .then(this.$axios.spread((res1, res2)=> {
         this.pointData = res1.data.data;
          // 给点位初始值
          this.form.pointOption = this.pointData[0].pointId;
          this.factorList = res2.data.data;
          //初始值
          this.form.selectValue = this.factorList.map(item=>item.factorCode);
          this.getAuditTableData(); // 获取已审核数据
          this.getRejectTableData(null); // 获取未通过数据
      }))
    this.historyPage.total = this.tableData.length;
    // 内容赋值
    this._setStantardValue();
  },
  methods: {
    // 判断是否是一个数字
    _checkNumber(n) {
    // 判断是否为数字
    let reg = /^[-+]?([0-9]+)([.]([0-9]+))?$/;
      return reg.test(n)
    },
    // 提交信息
    submitValue(name,facotrCode) {
      const options = this.dialogForm.map((item) => item).slice(1);
      const obj = {
        pointId: this.form.pointOption,
        reviewStatus: 0,
        submitter: getLocalstorage('UserId') || getUrlParams(top.location.href).UserGuid
      };
      if(options.every(item=>this._checkNumber(item[name]))) {
        obj.factorCode= facotrCode;
        obj.spanValues = options[0][name];
        obj.zeroStandard = options[1][name];
        obj.spanStandard = options[2][name];
        console.log(obj);
        this.save(obj)
      } else {
        this.$notify({
          title: '提示',
          message: '请输入正确的数值',
          type: "error"
        })
      }
    },
    // 保存
    save(data) {
      this.$axios({
        method: 'post',
        url: `${this.base}/spanValuesSetting/save`,
        headers: {'content-type': 'application/json;charset=UTF-8 '},
        data: JSON.stringify(data)
      }).then(res=> {
        this.$notify({
          title: '提示',
          message: res.data.msg,
          type: 'success'
        });
        /* this.getAuditTableData();// 获取已审核数据 */
        this.getNotAuditTableData(null); // 获取未审核数据
        this.tabsActive = '1';
      }).catch(err=> {
        this.$notify({
          title: '提示',
          message: err,
          type: "error"
        })
      })
    },
    // 显示设置内容弹窗
    dialogToggle() {
      this.dialogVisble = true;
      // 内容赋值
      this._setStantardValue();
    },
    // 历史记录点击操作
    historyClick(scope) {
      this.historyVisible = true;
      this.getHistoryData(scope.row.factorCode);
    },
    // 获取 选择的值
    _selectData() {},
    // 获取点位数据
    getPoints() {
      let userId = getLocalstorage('UserId') || getUrlParams(top.location.href).UserGuid
     return  this.$axios({
        method: "get",
        url: `${this.base}/spanValuesSetting/findPointList`,
        params: {userId: userId},
      })
    },
    // 获取因子下拉数据
    getFactors() {
     return this.$axios({
        method: "get",
        url: `${this.base}/spanValuesSetting/findFactorList`,
      })
    },
    // 获取点位审核数据
    getAuditTableData() {
      this.loading = true;
      this.$axios({
        method: 'get',
        url: `${this.base}/spanValuesSetting/findSettingByPoint`,
        params: {pointId: this.form.pointOption}
      }).then(res=> {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.getNotAuditTableData(null); // 获取未审核数据
        this.getRejectTableData(null); // 获取未通过数据
        this.tableData = res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode));
        this.sourceData = JSON.parse(JSON.stringify(res.data.data));
        this.factorList.forEach((item, index) => {
          console.log(item);
          this.$set(this.dialogForm, index, {
            cod: "",
            an: "",
            ph: "",
            nt: "",
          });
        });
        this._setStantardValue();
        // 平均值赋值
        this.sourceData.map((item)=> {
          switch (item.factorCode){
            case 'w01019': // 高锰酸盐指数
              this.dialogTableData[0].cod = item.weekAverage
              break;
            case 'w21003': //  氨氮
              this.dialogTableData[0].an = item.weekAverage;
              break;
            case 'w21011': // 总磷
              this.dialogTableData[0].ph = item.weekAverage
              break;
            case 'w21001':
              this.dialogTableData[0].nt = item.weekAverage;
              break;
            default:
              break
          }
        });
      }).catch((err)=> {
        this.loading = false;
        this.$notify({
          title: '提示',
          message: err,
          type: 'error'
        })
      })
    },
    // 获取未审核数据
    getNotAuditTableData(factorCode) {
      this.$axios({
        method: 'get',
        url: `${this.base}/spanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointIds: this.form.pointOption,factorCode: factorCode,reviewStatus: 0}
      }).then(res=> {
        this.auditNottableData = res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode));
      }).catch((err)=> {
        this.$notify({
          title: '提示',
          message: err,
          type: 'error'
        })
      })
    },
    // 获取未通过的数据
    getRejectTableData(factorCode) {
      this.$axios({
        method: 'get',
        url: `${this.base}/spanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointIds: this.form.pointOption,factorCode: factorCode,reviewStatus: 2}
      }).then(res=> {
        this.rejectTableData = res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode));
      }).catch((err)=> {
        this.$notify({
          title: '提示',
          message: err,
          type: 'error'
        })
      })
    },
    // 历史记录弹框 每页条数切换
    historySizeChange(val) {
      this.historyPage.pageSize = val;
      this.historyPage.currentPage = 1;
    },
    // 历史记录弹窗 切换页码
    historyCurrentChange(val) {
      this.historyPage.currentPage = val;
    },
    // 获取历史记录
    getHistoryData(factorCode) {
      this.$axios({
        method: 'get',
        url: `${this.base}/spanValuesSetting/findHistoryByPointAndFactory`,
        params: {
          pointIds: this.form.pointOption,
          reviewStatus: 1,
          factorCode: factorCode
        }
      }).then(res=> {
        this.historyData = res.data.data;
      })
    },
    // tabs切换
    tabClick() {
      
    },
    // 表格索引
    _index(idx) {
      return (this.historyPage.currentPage-1)*this.historyPage.pageSize + (idx+1)
    },
    _setStantardValue() {
      this.dialogForm.map((item, index) => {
        const codArr = this.sourceData.filter( // 高锰酸盐指数
          (item) => item.factorCode == "w01019"
        )
        const anArr = this.sourceData.filter(  // 氨氮
          (item) => item.factorCode == "w21003"
        )
        const phArr = this.sourceData.filter(  // 总磷
          (item) => item.factorCode == "w21011"
        )
        const ntArr = this.sourceData.filter(  // 总氮
          (item) => item.factorCode == "w21001"
        )
        console.log(codArr,anArr, phArr,ntArr);
      if (index == 1) {
        this.dialogForm[index].cod = codArr.length ? codArr[0].spanValues : null;
        this.dialogForm[index].an = anArr.length ? anArr[0].spanValues : null;
        this.dialogForm[index].ph = phArr.length ? phArr[0].spanValues : null;
        this.dialogForm[index].nt = ntArr.length ? ntArr[0].spanValues : null;
      } else if (index == 2) {
        this.dialogForm[index].cod = codArr.length ? codArr[0].zeroStandard : null;
        this.dialogForm[index].an = anArr.length ? anArr[0].zeroStandard : null;
        this.dialogForm[index].ph = phArr.length ? phArr[0].zeroStandard : null;
        this.dialogForm[index].nt = ntArr.length ? ntArr[0].zeroStandard : null;
      } else if (index == 3) {
        this.dialogForm[index].cod = codArr.length ? codArr[0].spanStandard : null;
        this.dialogForm[index].an = anArr.length ? anArr[0].spanStandard : null;
        this.dialogForm[index].ph = phArr.length ? phArr[0].spanStandard : null;
        this.dialogForm[index].nt = ntArr.length ? ntArr[0].spanStandard : null;
      }
    });
    }
  },
};
</script>

<style lang="scss" scoped>
.nav .el-form-item {
  margin-right: 30px;
}
.el-pagination {
  float: right;
  margin-top: 30px;
}
.daily-quality /deep/ .el-dialog__body {
  overflow: hidden;
}
.daily-quality /deep/ .el-table__header{
  width: 100% !important;
}
.daily-quality /deep/ .el-table__body{
  width: 100% !important;
}
.daily-quality /deep/ .el-dialog__header {
  cursor: move;
}
</style>