<template>
  <div id="app" class="daily-quality">
    <el-container>
      <el-main>
        <!--搜索条件-->
        <div class="nav">
          <el-form :model="form" :inline="true">
            <el-form-item label="点位"
              >
              <el-select v-model="form.pointOption" placeholder="请选择" >
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
              <el-table-column label="编号" prop="standardNumber"></el-table-column>
              <el-table-column label="标准溶液浓度" prop="spanStandard"></el-table-column>
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
              <el-table-column label="编号" prop="standardNumber"></el-table-column>
              <el-table-column label="标准溶液浓度" prop="spanStandard"></el-table-column>
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
              <el-table-column label="编号" prop="standardNumber"></el-table-column>
              <el-table-column label="标准溶液浓度" prop="spanStandard"></el-table-column>
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
      width="900"
      :visible.sync="dialogVisble"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      v-if="dialogVisble"
      v-draggable
      class="set_dialog"
      
    >
      <el-table :data="dialogTableData" :border="true" size="small">
        <el-table-column
          label="监测项目"
          prop="title"
          align="center"
        ></el-table-column>
        <el-table-column label="溶解氧" prop="cod" align="center">
          <template slot-scope="scope">
            <el-input
              required
              v-model="dialogForm[scope.$index].cod"
              placeholder="请输入"
              v-if="scope.row.cod != 'btn'"
            >
              <template slot="append" v-if="scope.row.cod == 'input'">mg/L</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.cod == 'btn'"
               v-preventReClick
              @click="submitValue('cod','w01009')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.cod)" 
              >{{ scope.row.cod }}mg/L</span
            >
          </template>
        </el-table-column>
        <el-table-column label="水温" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].water"
              placeholder="请输入"
              v-if="scope.row.water  != 'btn'"
            >
              <template slot="append" v-if="scope.row.cod == 'input'">°C</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.water == 'btn'"
               v-preventReClick
              @click="submitValue('water', 'w01010')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.water)"
              >{{ scope.row.water }}°C</span
            >
          </template>
        </el-table-column>
        <el-table-column label="电导率" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].dian"
              placeholder="请输入"
              v-if="scope.row.dian  != 'btn'"
            >
              <template slot="append" v-if="scope.row.cod == 'input'">μS/cm</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.dian == 'btn'"
               v-preventReClick
              @click="submitValue('dian', 'w01014')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.dian)"
              >{{ scope.row.ph }}μS/cm</span
            >
          </template>
        </el-table-column>
        <el-table-column label="浊度" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].zhuo"
              placeholder="请输入"
              v-if="scope.row.zhuo  != 'btn'"
            >
              <template slot="append" v-if="scope.row.cod == 'input'">NTU</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.zhuo == 'btn'"
               v-preventReClick
              @click="submitValue('zhuo', 'w01003')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.zhuo)"
              >{{ scope.row.zhuo }}NTU</span
            >
          </template>
        </el-table-column>
        <el-table-column label="ph" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="dialogForm[scope.$index].ph"
              placeholder="请输入"
              v-if="scope.row.ph  != 'btn'"
            >
              <template slot="append" v-if="scope.row.cod == 'input'">无量纲</template>
            </el-input>
            <el-button
              type="primary"
              v-if="scope.row.ph == 'btn'"
               v-preventReClick
              @click="submitValue('ph', 'w01001')"
              >提交</el-button
            >
            <span v-else-if="Number(scope.row.ph)"
              >{{ scope.row.ph }}无量纲</span
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
        <el-table-column label="编号" prop="standardNumber"></el-table-column>
        <el-table-column
          label="标准溶液浓度"
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
import { getLocalstorage } from '../js/utils';
import '../scss/globel.scss'
export default {
  name: "weekStandardValueConfig",
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
          title: "编号",
          cod: "input1", //溶解氧
          water: "input1", // 水温
          dian:'input1',
          ph: "input1", // ph
          zhuo: "input1", // 浊度
        },
        {
          title: "标准溶液浓度",
          cod: "input", //溶解氧
          water: "input", // 水温
          ph: "input", // ph
          zhuo: "input", // 浊度
          dian:'input',

        },
        
        {
          title: "",
          cod: "btn", //溶解氧
          water: "btn", // 水温
          ph: "btn", // ph
          zhuo: "btn", // 浊度
          dian:'btn'
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
      base: window.testUrl // 接口api地址
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
      // console.log(this.dialogForm.map((item) => item));
      const options = this.dialogForm.map((item) => item);
      const obj = {
        pointId: this.form.pointOption,
        reviewStatus: 0,
        submitter: getLocalstorage('userGuid') || '4aea3f54-4e3e-4c4e-b283-a90cc0c16873'
      };
      // 校验
       if(this._checkNumber(options[1][name])) {
        obj.factorCode= facotrCode;
        obj.standardNumber=options[0][name]
        obj.spanStandard = options[1][name];
        // console.log(obj);
        this.save(obj)
      } else {
        // console.log(obj);
        this.$notify({
          title: '提示',
          message: '请输入正确的数值',
          type: "error"
        })
      }
    },
    // 保存
    save(data) {
      console.log(JSON.stringify(data));
      this.$axios({
        method: 'post',
        url: `${this.base}/weekSpanValuesSetting/save`,
        headers: {'content-type': 'application/json;charset=UTF-8 '},
        data: JSON.stringify(data)
      }).then(res=> {
        this.$notify({
          title: '提示',
          message: res.data.msg,
          type: 'success'
        });
        this.getAuditTableData();// 获取已审核数据
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
      let userId = getLocalstorage('UserId') || '4aea3f54-4e3e-4c4e-b283-a90cc0c16873'
     return  this.$axios({
        method: "get",
        url: `${this.base}/weekSpanValuesSetting/findPointList`,
        params: {userId: userId},
      })
    },
    // 获取因子下拉数据
    getFactors() {
     return this.$axios({
        method: "get",
        url: `${this.base}/weekSpanValuesSetting/findFactorList`,
      })
    },
    // 获取点位审核数据
    getAuditTableData() {
      this.loading = true;
      this.$axios({
        method: 'get',
        url: `${this.base}/weekSpanValuesSetting/findSettingByPoint`,
        params: {pointId: this.form.pointOption}
      }).then(res=> {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.getNotAuditTableData(null); // 获取未审核数据
        this.getRejectTableData(null); // 获取未通过数据
       console.log(res);
        // this.tableData = res.data.data
        this.tableData =   res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode))
// console.log(arr);
   // console.log(JSON.parse(JSON.stringify(res.data.data)));
        this.sourceData = JSON.parse(JSON.stringify(res.data.data));
        this.factorList.forEach((item, index) => {
          console.log(item);
          this.$set(this.dialogForm, index, {
            cod: "",
            water: "",
            ph: "",
            zhuo: "",
            dian:""
          });
        });
        this._setStantardValue();
        // 平均值赋值
        this.sourceData.map((item)=> {
          console.log(item);
          switch (item.factorCode){
            case 'w01009': //溶解氧
              this.dialogTableData[0].cod = item.weekAverage
              break;
            case 'w01010': //  水温
              this.dialogTableData[0].water = item.weekAverage;
              break;
            case 'w01014': // 电导率
              this.dialogTableData[0].dian = item.weekAverage
              break;
            case 'w01003'://浊度
              this.dialogTableData[0].zhuo = item.weekAverage;
              break;
              case 'w01001'://ph
              this.dialogTableData[0].ph = item.weekAverage;
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
        url: `${this.base}/weekSpanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointIds: this.form.pointOption,
          factorCode: factorCode,reviewStatus: 0}
      }).then(res=> {
        this.auditNottableData = res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode));
        // this.auditNottableData = res.data.data
        res.data.data.filter(item=>{
          console.log(item);
        })
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
        url: `${this.base}/weekSpanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointIds: this.form.pointOption,factorCode: factorCode,reviewStatus: 2}
      }).then(res=> {
        // this.rejectTableData =res.data.data
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
        url: `${this.base}/weekSpanValuesSetting/findHistoryByPointAndFactory`,
        params: {
          pointIds: this.form.pointOption,
          reviewStatus: 1,
          factorCode: factorCode
        }
      }).then(res=> {
        console.log(factorCode);
        this.historyData = res.data.data.filter(item=>{
       return item.factorCode==factorCode
        });
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
      console.log(this.dialogForm);
      console.log(this.sourceData);
      this.dialogForm.map((item, index) => {
        const codArr = this.sourceData.filter( // 溶解氧
          (item) => item.factorCode == "w01009"
        )
        const waterArr = this.sourceData.filter(  // 水温
          (item) => item.factorCode == "w01010"
        )
        const dianArr = this.sourceData.filter(  // 电导率
          (item) => item.factorCode == "w01014"
        )
        const zhuoArr = this.sourceData.filter(  // 浊度
          (item) => item.factorCode == "w01003"
        )
        const phArr = this.sourceData.filter(  // ph
          (item) => item.factorCode == "w01001"
        )
        console.log(codArr,waterArr, dianArr,zhuoArr,phArr);
        console.log(index);
 if (index == 0) {
        // 编号
        this.dialogForm[index].cod = codArr.length ? codArr[0].standardNumber : null;
        this.dialogForm[index].water = waterArr.length ? waterArr[0].standardNumber : null;
        this.dialogForm[index].zhuo = zhuoArr.length ? zhuoArr[0].standardNumber : null;
        this.dialogForm[index].dian = dianArr.length ? dianArr[0].standardNumber : null;
        this.dialogForm[index].ph = phArr.length ? phArr[0].standardNumber : null;

      }else if(index == 1){
// 标准浓度
this.dialogForm[index].cod = codArr.length ? codArr[0].spanStandard : null;
        this.dialogForm[index].water = waterArr.length ? waterArr[0].spanStandard : null;
        this.dialogForm[index].zhuo = zhuoArr.length ? zhuoArr[0].spanStandard : null;
        this.dialogForm[index].dian = dianArr.length ? dianArr[0].spanStandard : null;
        this.dialogForm[index].ph = phArr.length ? phArr[0].spanStandard : null;
      }
    });
    }
  },
};
</script>

<style >
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
.set_dialog .el-dialog{
  width: 900px !important;
}
</style>
