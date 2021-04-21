
<template>
  <div class="daily-quality">
    <el-container>
      <el-main>
        <div class="nav">
          <!--搜索条件-->
          <el-form :model="form" :inline="true">
            <el-form-item label="点位"
              >
              <el-select v-model="form.pointOption" placeholder="请选择">
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
              <el-button type="primary" @click="getNotAuditList(null)" v-preventReClick icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" @click="audit" icon="el-icon-check"
                >审核</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!--数据表格-->
        <el-table ref="eltree" :data="auditNottableData" size="middle" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column type="selection"></el-table-column>
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="rowClick(scope)"></el-button>
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
                label="零点标准浓液浓度"
                prop="zeroStandard"
              ></el-table-column>
              <el-table-column
                label="跨度标准浓液浓度"
                prop="spanStandard"
              ></el-table-column>
              <el-table-column label="提交人" prop="submitterName"></el-table-column>
              <el-table-column label="提交时间" prop="submissionTime" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
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
  </div>
</template>

<script>
import { getLocalstorage } from '../js/utils';
import '../scss/globel.scss'
export default {
  name: "StandardAudit",
  data() {
    return {
      form: {                     // 表单数据
        selectValue: [],
        pointOption: ''
      },
      factorList: [], // 因子列表
      auditNottableData: [], // 未审核数据
      auditDialogVisble: false, // 审核弹窗显示控制
      loading: false, // 表格loading
      pointData: [], // 点位数据
      multiSelection: [], // 表格选中的行数据
      auditForm: { //  是否审核参数
        radio: '1',
      },
      base: window.API // 接口api地址
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
  },
  mounted() {
    // 初始化数据
    this.$axios.all([this.getPoints(),this.getFactors()])
      .then(this.$axios.spread((res1, res2)=> {
         this.pointData = res1.data.data;
          // 给点位初始值
          this.form.pointOption = this.pointData[0].pointId;
          this.factorList = res2.data.data;
          //初始值
          this.form.selectValue = this.factorList.map(item=>item.factorCode);
          this.getNotAuditList(null); // 获取已审核数据
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
      console.log(scope);
      this.historyVisible = true;
    },
    // 获取 选择的值
    _selectData() {},
    // 获取点位数据
    getPoints() {
      let userId = getLocalstorage('UserId')
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
    // 获取未审核数据
    getNotAuditList(factorCode) {
      this.loading = true;
      this.$axios({
        method: 'get',
        url: `${this.base}/spanValuesSetting/findHistoryByPointAndFactory`,
        params: {pointId: this.form.pointOption,factorCode: factorCode,reviewStatus: 0}
      }).then(res=> {
        this.auditNottableData = res.data.data.filter(item=>this.form.selectValue.includes(item.factorCode));
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
      let userId = getLocalstorage('UserId')
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
        url: `${this.base}/spanValuesSetting/review`,
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