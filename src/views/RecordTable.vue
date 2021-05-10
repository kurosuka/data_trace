<template>
  <div id="app" class="daily-quality">
    <el-container>
      <el-main>
        <!--搜索条件-->
        <div class="nav">
          <el-form :model="form" :inline="true">
            <el-form-item label="点位">
              <!--  <multi-select :selectData="pointData" :defaultData="form.pointOption" @changeData="handlePointChangeData"
              :multiType="true" :defaultProps="{children: 'children', label: 'name'}"></multi-select> -->
              <el-select v-model="form.pointOption" placeholder="请选择" :multiple="true">
                <el-option v-for="item in pointData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="监测项目">
              <!-- <el-tooltip :content="selectTooltip" placement="top" :disabled="form.selectValue.length == 0"> -->
              <el-select v-model="form.selectValue" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option v-for="item in factorList" :key="item.factorCode" :label="item.factorName"
                  :value="item.factorCode"></el-option>
              </el-select>
              <!-- </el-tooltip> -->
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" icon="el-icon-download">导出</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" @click="handleRecord">备案</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--tab页切换-->
        <el-table :data="tableData" size="middle" height="700px">
          <el-table-column label="序号" type="index">
            <template slot-scope="scope">
              <span>{{_index(scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="点位名称" prop="pointName"></el-table-column>
          <el-table-column label="仪器设备" prop="device"></el-table-column>
          <el-table-column label="量程" prop="range"></el-table-column>
          <el-table-column label="量程范围" prop="measuringRange"></el-table-column>
          <el-table-column label="关键参数" prop="keyParams"></el-table-column>
          <el-table-column label="最小值" prop="min"></el-table-column>
          <el-table-column label="最大值" prop="max"></el-table-column>
          <el-table-column label="单位" prop="unit"></el-table-column>
          <el-table-column label="备案人员" prop="people"></el-table-column>
          <el-table-column label="备案时间" prop="tstamp"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 备案弹出框 -->
    <el-dialog title="备案" :visible.sync="recordDialog" width="1000px" :before-close="handleClose">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div>
          <el-form-item label="水站名称:" prop="pointName" class="form_style">
            <el-input v-model="ruleForm.pointName"></el-input>
          </el-form-item>
          <el-form-item label="运营单位:" prop="company" class="form_style">
            <el-input v-model="ruleForm.company"></el-input>
          </el-form-item>
        </div>
        <div>
          <!--  <el-form-item label="仪器设备:" prop="device" class="form_style">
            <el-input v-model="ruleForm.device"></el-input>
          </el-form-item>
          <el-form-item label="厂家/型号:" prop="company" class="form_style">
            <el-input v-model="ruleForm.manufacturerOrModel" readonly></el-input>
          </el-form-item> -->
          <el-form-item label="监测因子:" prop="device" class="form_style">
            <el-select v-model="ruleForm.factorId" placeholder="请选择" :collapse-tags="true" @change="handleRangeChanged">
              <el-option v-for="item in factorList" :key="item.factorCode" :label="item.factorName"
                :value="item.factorCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分析方法:" prop="company" class="form_style">
            <el-select v-model="ruleForm.analyze" placeholder="请选择" :collapse-tags="true">
              <el-option v-for="item in analyzeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!-- 量程范围登记 -->
          <el-tab-pane label="量程范围登记" name="range">
            <el-button type="primary" icon="el-icon-plus" @click="handleSave">新增</el-button>

            <div class="ruleForm_span">
              <span>备注:</span>
              <span>名称：量程一，量程二</span>
              <span>值：默认填写量程范围最大值，如果量程范围为：0-50，则填写50，不允许填写0-50或0~50或0,50等</span>
            </div>
            <el-table border ref="multipleTable" :data="ruleFormTableData" tooltip-effect="dark" style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column label="删除">
                <template slot-scope="scope">
                  <el-button @click="delete(scope.row,scope.$index)" icon="el-icon-delete" type="danger"></el-button>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="pointName"></el-table-column>
              <el-table-column label="上限" prop="upper"></el-table-column>
              <el-table-column label="下限" prop="low"></el-table-column>
              <el-table-column label="是否启用">
                <template slot-scope="scope">
                  <!-- 启用 -->
                  <div v-if="scope.row.isEnabled=='1'">
                    <el-button type="primary" @click="handleEnabled('1')">启用</el-button>
                    <el-button @click="handleEnabled('0')">未启用</el-button>
                  </div>
                  <!-- 未启用 -->
                  <div v-else>
                    <el-button @click="handleEnabled('1')">启用</el-button>
                    <el-button type="primary" @click="handleEnabled('0')">未启用</el-button>
                  </div>
                </template>

              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--关键参数登记  -->
          <el-tab-pane label="关键参数登记" name="keyParams">
            <div style="margin: 3px 0;">
              <span>请选择量程：</span>
              <el-select v-model="ruleForm.rangeId" placeholder="请选择" :collapse-tags="true" style="width: 110px;">
                <el-option v-for="item in rangeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <span style="margin-left:20px;">状态参数：</span>
              <el-select v-model="ruleForm.statusId" placeholder="请选择" :multiple="true" :collapse-tags="true"
                style="width: 210px;" @change="handleStatusChange">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div style="font-size: 12px;margin: 10px 0;color: red;">备案值为区间范围，请填写最小值、最大值；固定值：最小值与最大值保持一致！只允许录入数字</div>
            <el-form class="keyParams_form" :model="keyParamsForm" ref="keyParamsForm" label-width="100px">
              <el-form-item v-for="(item,index) in keyParamsList" :label="item.name" :key="item.id"
                class="keyparams_style">
                <!--  <el-input v-model="item.upper"></el-input>
                <el-input v-model="item.low"></el-input>
                <el-input v-model="item.unit"></el-input> -->
                <el-input v-model="addForm[index].upper"></el-input>
                <el-input v-model="addForm[index].low"></el-input>
                <el-input v-model="addForm[index].unit"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recordDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRecordSave">备案</el-button>
      </span>
    </el-dialog>
    <!-- 量程登记表点击保存弹出模态框 -->
    <el-dialog title="新增" :visible.sync="saveDialog" width="568px" :before-close="handleClose">
      <el-form :model="saveForm" ref="saveForm" label-width="100px">
        <div>
          <el-form-item label="名称:" prop="rangeId" class="form_style">
            <el-select v-model="saveForm.rangeId" placeholder="请选择" :collapse-tags="true">
              <el-option v-for="item in rangeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位:" prop="unit" class="form_style">
            <el-input v-model="saveForm.unit"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="下限:" prop="low" class="form_style">
            <el-input v-model="saveForm.low"></el-input>
          </el-form-item>
          <el-form-item label="上限:" prop="upper" class="form_style">
            <el-input v-model="saveForm.upper"></el-input>
          </el-form-item>
          <!--  <el-form-item label="是否启用：">
            <el-radio v-model="saveForm.isEnabled" label="1">是</el-radio>
            <el-radio v-model="saveForm.isEnabled" label="0">否</el-radio>
          </el-form-item> -->
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <el-footer>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[30,40,50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-footer>
  </div>
</template>

<script>
  import { getLocalstorage } from '../js/utils';
  import '../scss/globel.scss'
  // import MutiSelect from '../components/MutiSelect.vue'
  export default {
    /*    components: {
         MutiSelect
       }, */
    name: "RecordTable",
    data() {
      return {
        loading: false,
        // 查询条件
        form: {                     // 表单数据
          selectValue: [1, 2, 3, 4],
          pointOption: [1]
        },
        pointData: [{ id: 1, name: '苏州市' }],              // 点位数据
        factorList: [{ factorCode: 1, factorName: '高锰酸盐指数' },
        { factorCode: 2, factorName: '氨氮' },
        { factorCode: 3, factorName: '总磷' },
        { factorCode: 4, factorName: '总氮' }],             // 因子下拉数据
        tableData: [{
          id: 1,
          pointName: '城西水厂',
          pointUid: 'chengxishuichang',
          device: '氨氮水质自动分析仪',
          range: '量程二',
          measuringRange: '10',
          keyParams: '测量检出限',
          min: '0.02',
          max: '0.02',
          unit: 'mg/L',
          people: '小花',
          tstamp: '2019-12-20'
        },
        {
          id: 2,
          pointName: '城西水厂',
          pointUid: 'chengxishuichang',
          device: '氨氮水质自动分析仪',
          range: '量程二',
          measuringRange: '10',
          keyParams: '消解温度',
          min: '40',
          max: '60',
          unit: 'mg/L',
          people: '小花',
          tstamp: '2019-12-20'
        },
        {
          id: 3,
          pointName: '城西水厂(一)',
          pointUid: 'chengxishuichang1',
          device: '氨氮水质自动分析仪（1）',
          range: '量程二',
          measuringRange: '10',
          keyParams: '消解温度',
          min: '4',
          max: '10',
          unit: 'min',
          people: '小花',
          tstamp: '2019-12-20'
        }],

        // tab栏切换
        // 量程范围登记
        ruleForm: {
          pointName: '',//水站名称
          company: '',//运营单位
          device: '',//仪器设备
          manufacturerOrModel: '',//厂家/型号
          rangeId: '',//量程
          values: '',//量程值
          factorId: '',
          analyze: '',//分析方法
        },
        analyzeList: [{ id: 1, name: '方法1' }],//分析方法
        statusList: [],//状态参数
        // 新增表单
        saveForm: {
          rangeId: '',//量程名
          upper: '',
          low: '',
          unit: '',
          isEnabled: '1'
        },
        activeName: 'range',
        rangeList: [{ id: 1, name: '量程一' }, { id: 2, name: '量程二' }, { id: 3, name: '量程三' }],
        ruleFormTableData: [{
          pointName: '量程一',
          low: 0,
          upper: 50,
          pointUid: 1,
          isEnabled: '1'
        }],
        // 关键参数登记
        keyParamsForm: {},
        keyParamsList: [/* { name: '测量检出限', id: '1', unit: '' },
        { name: '消解温度', id: '2', unit: '℃' },
        { name: '消解时长', id: '3', unit: 'min' },
        { name: '显色温度', id: '4', unit: '℃' },
        { name: '显色时间', id: '5', unit: 'min' },
        { name: '稀释倍数', id: '6', unit: '' },
        { name: '曲线斜率', id: '7', unit: '' },
        { name: '曲线截距', id: '8', unit: '' },
        { name: '线型相关系数', id: '9', unit: '' },
        { name: '二次多项式系数', id: '11', unit: '' },
        { name: '三项式系数', id: '12', unit: '' },
        { name: '空白标定系数', id: '13', unit: '' },
        { name: '量程系数', id: '14', unit: '' } */],
        addForm: [
          {
            id: '',//名称
            name: '',
            upper: '',
            low: '',
            unit: ''
          }
        ],
        // 分页
        currentPage: 1,
        pageSize: 30,
        total: 1,
        recordDialog: false,
        saveDialog: false,
        multipleSelection: [],
        base: window.testUrl // 接口api地址
      };
    },
    watch: {
      keyParamsList(newVal, oldVal) {//状态参数每选一次，执行一次该方法
        console.log(newVal, oldVal);//选中的状态参数对象
        newVal.forEach((item, i) => {
          this.$set(this.addForm, i, {
            id: '',
            name: '',
            upper: '',
            low: '',
            unit: ''
          })
          this.addForm[i].id = item.id
          this.addForm[i].name = item.name
          this.addForm[i].upper = item.upper
          this.addForm[i].low = item.low
          this.addForm[i].unit = item.unit
        })
        console.log(this.addForm);
      }
    },
    mounted() {

    },
    methods: {
      // 判断是否是一个数字
      _checkNumber(n) {
        // 判断是否为数字
        let reg = /^[-+]?([0-9]+)([.]([0-9]+))?$/;
        return reg.test(n)
      },
      getPage() { },
      // 备案
      handleRecord() {
        this.recordDialog = true
      },
      // tab切换
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 量程范围登记
      handleSave() {
        console.log('save');
        this.saveDialog = true
      },
      // 保存量程范围登记
      save() { },
      // 是否启用
      handleEnabled(val) {
        console.log(val);
      },
      // 触发状态参数
      handleRangeChanged(val) {
        console.log(val);//监测因子id
        this.$axios.get('status.json').then(res => {
          console.log(res.data);
          this.statusList = []
          this.statusList = res.data.map(item => item)
        }).catch(err => {
          console.log(err);
        })
      },
      // 状态参数
      handleStatusChange(val) {
        // console.log(val);//检出限id  []
        this.keyParamsList = this.statusList.filter(item => {
          return val.includes(item.id)
        }).map(ite => {
          return ite
        })
        console.log(this.keyParamsList);//选中的参数对象
      },
      // 备案模态框保存
      handleRecordSave() {
        var newForm = []
        this.addForm.map((ite) => {
          newForm.push({
            // 备案时需要传的参数
            pointName: this.ruleForm.pointName,//水站名称
            company: this.ruleForm.company,//运营单位
            factorId: this.ruleForm.factorId,//监测因子
            analyze: this.form.analyze,//分析方法
            id: ite.id,//状态参数
            name: ite.name,
            upper: ite.upper,
            low: ite.low,
            unit: ite.unit,
          })
        })
        console.log(newForm);
      },
      // 获取点位数据
      getPoints() {
        let userId = getLocalstorage('UserGuid') || '4aea3f54-4e3e-4c4e-b283-a90cc0c16873'
        return this.$axios({
          method: "get",
          url: `${this.base}/weekSpanValuesSetting/findPointList`,
          params: { userId: userId },
        })
      },
      // 获取因子下拉数据
      getFactors() {
        return this.$axios({
          method: "get",
          url: `${this.base}/weekSpanValuesSetting/findFactorList`,
        })
      },
      handlePointChangeData(val) {
        console.log(val);
      },
      // 分页
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val
      },
      // 表格索引
      _index(idx) {
        return (this.currentPage - 1) * this.pageSize + (idx + 1)
      },
      handleClose() {
        this.recordDialog = false
        this.saveDialog = false
        this.activeName = 'range'
      },
      delete(row, index) {
        console.log(1);
        console.log(row, index);
      },
      // 复选框
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
  };
</script>

<style>
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

  .daily-quality /deep/ .el-table__header {
    width: 100% !important;
  }

  .daily-quality /deep/ .el-table__body {
    width: 100% !important;
  }

  .daily-quality /deep/ .el-dialog__header {
    cursor: move;
  }

  .set_dialog .el-dialog {
    width: 900px !important;
  }

  .form_style {
    display: inline-block;
    width: 250px;
  }

  .ruleForm_span span {
    display: block;
    color: red;
    padding: 2px 0;
  }

  .keyparams_style .el-input {
    width: 110px;
    margin: 0 20px;
  }

  .keyParams_form {
    /*   border: 1px solid #E4E7ED;
    border-radius: 3px;
    padding: 10px 0;
    margin-top: 5px; */
  }
</style>
