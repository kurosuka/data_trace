<template>
  <div id="app" class="daily-quality">
    <el-container>
      <el-main>
        <div class="nav">
          <!--搜索条件-->
          <el-form :model="form" :inline="true">
            <el-form-item label="点位">
              <el-tooltip :content="selectTooltipPoint" placement="top" :disabled="form.pointOption.length == 0">
              <el-select v-model="form.pointOption" multiple collapse-tags  placeholder="请选择" >
                <el-option v-for="item in pointData" :key="item.pointId" :label="item.pointName" :value="item.pointId">
                </el-option>
              </el-select>
              </el-tooltip>
              <!-- <el-select v-model="form.pointOption" placeholder="请选择">
                <el-option v-for="item in pointData" :key="item.pointId" :label="item.pointName" :value="item.pointId"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="监测项目">
              <el-tooltip :content="selectTooltip" placement="top" :disabled="form.selectValue.length == 0">
                <el-select v-model="form.selectValue" placeholder="请选择" :multiple="true" :collapse-tags="true">
                  <el-option v-for="item in factorList" :key="item.factorCode" :label="item.factorName"
                    :value="item.factorCode"></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getNotAuditList(null)" v-preventReClick>查询</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" @click="audit">审核</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- tab页 -->
        <el-tabs v-model="activeName" type="card" >
          <el-tab-pane label="未审核" >
            <!--数据表格-->
        <el-table ref="eltree" :data="auditNottableData" size="middle" @selection-change="handleSelectionChange"
        v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="rowClick(scope)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="点位名称" prop="pointName"></el-table-column>
        <el-table-column label="监测项目" prop="factorName"></el-table-column>
        <el-table-column label="编号" prop="standardNumber"></el-table-column>
        <el-table-column label="跨度标准浓液浓度" prop="spanStandard"></el-table-column>
        <el-table-column label="提交人" prop="submitterName"></el-table-column>
        <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
          </el-tab-pane>
          <el-tab-pane label="已审核">
            <el-table :data="tableData" size="middle">
              <el-table-column label="序号" type="index"></el-table-column>
              <!-- 
                <template slot-scope="scope">
                  <span>{{_index(scope.$index)}}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                label="点位名称"
                prop="pointName"
              ></el-table-column>
              <el-table-column
                label="监测项目"
                prop="factorName"
              ></el-table-column>
              <el-table-column label="编号" prop="standardNumber"></el-table-column>
              <el-table-column label="标准液浓度" prop="spanStandard"></el-table-column>
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
          <el-tab-pane label="未通过" >
            <el-table :data="rejectTableData" size="middle">
              <el-table-column label="序号" type="index">
                <!-- <template slot-scope="scope">
                  <span>{{_index(scope.$index)}}</span>
                </template> -->
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
              <el-table-column label="标准浓液浓度" prop="spanStandard"></el-table-column>
              <el-table-column label="提交人" prop="submitterName"></el-table-column>
              <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="审核人" prop="reviewerName"></el-table-column>
              <el-table-column label="审核时间" prop="reviewTime" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        
      </el-main>
    </el-container>
    <!--审核弹窗-->
    <el-dialog title="审核" :visible.sync="auditDialogVisble" width="30%" :close-on-click-modal="false">
      <el-form :model="auditForm">
        <el-form-item label="是否通过审核">
          <el-radio-group v-model="auditForm.radio">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="auditClick" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>
    <!--历史记录-->
    <el-dialog
      title="操作记录"
      :visible.sync="historyVisible"
      :close-on-click-modal="false"
      v-if="historyVisible"
      height="600px"
    >
      <el-table :data="historyData" height="calc(500px - 80px)">
        <el-table-column label="序号" type="index">
          <!-- <template slot-scope="scope">
            <span>{{_index(scope.$index)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="点位名称" prop="pointName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="监测项目" prop="factorName"></el-table-column>
        <!-- <el-table-column label="跨度值" prop="spanValues"></el-table-column> -->
        <!-- <el-table-column label="零点标准浓液浓度" prop="zeroStandard"></el-table-column> -->
        <el-table-column label="编号" prop="standardNumber"></el-table-column>
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
     <!--设置标准值弹窗-->
     <el-dialog
     title="项目设置详情"
     :visible.sync="dialogVisble"
     :close-on-click-modal="false"
     :destroy-on-close="true"
     v-if="dialogVisble"
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
             <template slot="append" v-if="scope.row.cod == 'input'">mg/L</template>
           </el-input>
           <el-button
             type="primary"
             v-if="scope.row.water == 'btn'"
              v-preventReClick
             @click="submitValue('water', 'w01010')"
             >提交</el-button
           >
           <span v-else-if="Number(scope.row.water)"
             >{{ scope.row.water }}mg/L</span
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
             <template slot="append" v-if="scope.row.cod == 'input'">mg/L</template>
           </el-input>
           <el-button
             type="primary"
             v-if="scope.row.dian == 'btn'"
              v-preventReClick
             @click="submitValue('dian', 'w01014')"
             >提交</el-button
           >
           <span v-else-if="Number(scope.row.dian)"
             >{{ scope.row.ph }}mg/L</span
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
             <template slot="append" v-if="scope.row.cod == 'input'">mg/L</template>
           </el-input>
           <el-button
             type="primary"
             v-if="scope.row.zhuo == 'btn'"
              v-preventReClick
             @click="submitValue('zhuo', 'w01003')"
             >提交</el-button
           >
           <span v-else-if="Number(scope.row.zhuo)"
             >{{ scope.row.zhuo }}mg/L</span
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
             <template slot="append" v-if="scope.row.cod == 'input'">mg/L</template>
           </el-input>
           <el-button
             type="primary"
             v-if="scope.row.ph == 'btn'"
              v-preventReClick
             @click="submitValue('ph', 'w01001')"
             >提交</el-button
           >
           <span v-else-if="Number(scope.row.ph)"
             >{{ scope.row.ph }}mg/L</span
           >
         </template>
       </el-table-column>
     </el-table>
   </el-dialog>
  </div>
</template>

<script>
  import { getLocalstorage } from '../js/utils';
  import '../scss/globel.scss'
  export default {

    name: "weekStandardAudit",
    data() {
      return {
        form: {                     // 表单数据
          selectValue: [],
          pointOption: []
        },
        factorList: [], // 因子列表
        auditNottableData: [], // 未审核数据
        tableData: [],              // 已审核数据
        historyData: [], // 当前点位因子历史记录
        rejectTableData: [],        // 未通过的审核数据
        auditDialogVisble: false, // 审核弹窗显示控制
        historyVisible:false,
        loading: false, // 表格loading
        dialogVisble: false, // 弹框是否显示
        pointData: [], // 点位数据
        multiSelection: [], // 表格选中的行数据
        auditForm: { //  是否审核参数
          radio: '1',
        },

        historyPage: {
        currentPage: 1,
        pageSize: 20,
        total: 80
      },
        base: window.testUrl, // 接口api地址
        activeName:0,
      };
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
      selectTooltipPoint(){
        return this.pointData
          .filter((item) => {
            return this.form.pointOption.includes(item.pointId);
          })
          .map((item) => {
            return item.pointName;
          })
          .join(",");
      }
    },
    mounted() {
      // 初始化数据
      this.$axios.all([this.getPoints(), this.getFactors()])
        .then(this.$axios.spread((res1, res2) => {
          console.log(res1);
          this.form.pointOption =[]
          this.pointData = res1.data.data;
          console.log(this.pointData[0].pointId);
          // 给点位初始值
          this.form.pointOption .push(this.pointData[0].pointId);
          this.factorList = res2.data.data;
          //初始值
          this.form.selectValue = this.factorList.map(item => item.factorCode);
    this.historyPage.total = this.tableData.length;
         
          this.getNotAuditList(null); // 获取wei审核数据
          this.getAuditTableData()
          this.getRejectTableData(null); // 获取未通过数据
        }))
    },
    methods: {
      // 审核
    audit() {
      if(this.multiSelection.length === 0) {
        this.$notify({
          title: '提示',
          message: '请选择要审核的数据',
          type: 'warning'
        })
        return
      }
      // 审核接口调用
      this.auditDialogVisble = true
    },
    // 历史记录点击操作
    historyClick(scope) {
      this.historyVisible = true;
      this.getHistoryData(scope.row.factorCode);
    },
    // 获取历史记录
    getHistoryData(factorCode) {
      this.$axios({
        method: 'get',
        url: `${this.base}/weekSpanValuesSetting/findHistoryByPointAndFactory`,
        params: {
          pointId: this.form.pointOption.toString(),
          reviewStatus: 1,
          factorCode: factorCode
        }
      }).then(res=> {
        this.historyData = res.data.data;
      })
    },
    // 获取 选择的值
    _selectData() {},
     // 显示设置内容弹窗
     dialogToggle() {
      this.dialogVisble = true;
      // 内容赋值
      // this._setStantardValue();
    },
    // 获取点位数据
    getPoints() {
      let userId = getLocalstorage('UserGuid') || '4aea3f54-4e3e-4c4e-b283-a90cc0c16873'
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
    // 获取未审核数据
    getNotAuditList(factorCode) {
      console.log(factorCode);
      this.loading = true;
      this.$axios({
        method: 'get',
        url: `${this.base}/weekSpanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointId: this.form.pointOption.toString(),
          factorCode: factorCode,
          reviewStatus: 0}
      }).then(res=> {
        // this.auditNottableData = res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode));
        this.auditNottableData = res.data.data
        
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }).catch((err)=> {
        this.$notify({
          title: '提示',
          message: err,
          type: 'error'
        });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      })
    },
  //  已通过
    getAuditTableData(){
      this.loading = true;
      this.$axios({
        method: 'get',
        url: `${this.base}/weekSpanValuesSetting/findSettingByPoint`,
        params: {pointId: this.form.pointOption.toString()}
      }).then(res=>{
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.getNotAuditList(null); // 获取未审核数据
        // this.getRejectTableData(null); // 获取未通过数据
       console.log(res);
        this.tableData = res.data.data
      })

    },
  
  // 获取未通过的数据
  getRejectTableData(factorCode) {
      this.$axios({
        method: 'get',
        url: `${this.base}/weekSpanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointId: this.form.pointOption.toString(),factorCode: factorCode,reviewStatus: 2}
      }).then(res=> {
        this.rejectTableData = res.data.data
      }).catch((err)=> {
        this.$notify({
          title: '提示',
          message: err,
          type: 'error'
        })
      })
    },
    // 表格行数据选择
    handleSelectionChange(val) {
      console.log(val);
      this.multiSelection = val;
    },
    // 单行审核
    rowClick(data) {
      console.log(data.row,this.$refs.eltree.multiSelection);
      this.$refs.eltree.clearSelection();
      this.$refs.eltree.toggleRowSelection(data.row);
      this.auditDialogVisble = true;
    },
    // 审核按钮点击
    auditClick() {
      let userId = getLocalstorage('UserGuid') || '4aea3f54-4e3e-4c4e-b283-a90cc0c16873'
      const data = this.multiSelection.map(item=> {
        return {
          id: item.id,
          reviewStatus: this.auditForm.radio,
          reviewer: userId
        }
      })
      this.saveAudit(data)
    },
    // 审核ajax交互
    saveAudit(data = {}) {
      console.log(data);
      this.$axios({
        method: 'put',
        url: `${this.base}/weekSpanValuesSetting/review`,
        headers: { 'content-type': 'application/json;charset=UTF-8' },
        data
      }).then(res=> {
        console.log(res);
        this.$notify({
          title: '提示',
          message: res.data.msg,
          type: 'success'
        });
        this.auditDialogVisble = false;
        this.getNotAuditList(null);
      }).catch(err=>{
        this.$notify({
          title: '提示',
          message: err,
          type: "danger"
        })
      })
    },
    close() {
      this.auditDialogVisble = false;
    }
  },
  };
</script>

<style lang="scss" scoped>
  .nav .el-form-item {
    margin-right: 30px;
  }
</style>
