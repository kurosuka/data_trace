<template>
  <div id="app" class="daily-quality">
    <el-container>
      <el-main>
        <!--搜索条件-->
        <div class="nav">
          <el-form :model="form" :inline="true">
            <el-form-item label="点位">
              <muti-select :selectData="pointData" :defaultData="form.pointOption" @changeData="handlePointChangeData"
                :multiType="true" :defaultProps="{children: 'children', label: 'title'}"></muti-select>
            </el-form-item>
            <el-form-item label="监测项目">
              <el-select v-model="form.selectValue" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option v-for="item in factorList" :key="item.factorCode" :label="item.factorName"
                  :value="item.factorCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="exportTable" icon="el-icon-download">导出</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" @click="handleRecord">备案</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="danger" @click="handleDelete('uid')" icon="el-icon-delete"
                :disabled="multipleSelection.length>0?false:true">删除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="display: flex;">
          <!-- left -->
          <div style="flex: 1;padding-right: 5px;">
            <el-table :data="tableData" size="middle" height="80vh" @row-click="handleRowClick" border
              @selection-change="handleSelectionChange" highlight-current-row @current-change="handleCurrentChange2"
              ref="tableDataRef">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column label="序号" type="index" width="60">
                <template slot-scope="scope">
                  <span>{{_index(scope.$index)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="点位名称" prop="pointName" width="120"></el-table-column>
              <el-table-column label="因子(仪器)" prop="factorName" width="200"></el-table-column>
              <el-table-column label="量程" prop="rangeName"></el-table-column>
              <el-table-column label="量程上限" prop="upperRangeLimit"></el-table-column>
              <el-table-column label="量程下限" prop="lowerRangeLimit"></el-table-column>
              <el-table-column label="量程单位" prop="measureUnitName"></el-table-column>
              <el-table-column label="是否启用" width="120">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.useOrNot" active-text="是" inactive-text="否"
                    @change="handleEnabled(scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- right -->
          <div style="flex: 1;padding-left: 10px;">
            <el-table :data="tableDataRight" size="middle" border>
              <el-table-column label="关键参数" prop="paramName"></el-table-column>
              <el-table-column label="参数下限" prop="paramLowerLimit"></el-table-column>
              <el-table-column label="参数上限" prop="paramUpperLimit"></el-table-column>
              <el-table-column label="单位" prop="measureUnitName"></el-table-column>
              <el-table-column label="备案人员" prop="creator"></el-table-column>
              <el-table-column label="备案时间" prop="createTime" width="180"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <!--tab页切换-->
    <!-- 备案弹出框 -->
    <el-dialog title="备案" :visible.sync="recordDialog" width="1000px" :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <div>
          <el-form-item label="水站名称:" prop="newPointId" class="form_style">
            <!-- ruleForm.pointName -->
            <multi-check-box :sourceData="pointData" :defaultSelect="[]" @selectValue="handleRange" :multiType="false"
              :defaultProps="{children: 'children', label: 'title'}"></multi-check-box>
          </el-form-item>
          <el-form-item label="运营单位:" class="form_style">
            <el-input v-model="ruleForm.company" readonly></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="监测因子:" prop="factorId" class="form_style">
            <el-select v-model="ruleForm.factorId" placeholder="请选择" :collapse-tags="true" @change="handleFactor">
              <el-option v-for="item in factorList" :key="item.factorCode" :label="item.factorName"
                :value="item.factorCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分析方法:" class="form_style">
            <el-select v-model="ruleForm.analyze" placeholder="请选择" :collapse-tags="true" disabled>
              <el-option v-for="item in analyzeList" :key="item.analysisMethodUid" :label="item.analysisMethodName"
                :value="item.analysisMethodUid" ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!-- 量程范围登记 -->
          <el-tab-pane label="量程范围登记" name="range">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd('ruleForm')" style="margin-bottom: 10px;">新增
            </el-button>
            <div class="ruleForm_span">
              <el-alert
    title="名称：量程一，量程二，...；值：如量程为0-50，下限填写0，上限填写50"
    type="warning"
    show-icon :closable="false">
  </el-alert>
            </div>
            <el-table border ref="multipleTable" :data="ruleFormTableData" tooltip-effect="dark" style="width: 100%">
              <el-table-column label="删除">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleDelete('rangeUid',scope.$index, scope.row)"
                    icon="el-icon-delete">
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="rangeName"></el-table-column>
              <el-table-column label="上限" prop="upperRangeLimit"></el-table-column>
              <el-table-column label="下限" prop="lowerRangeLimit"></el-table-column>
              <el-table-column label="单位" prop="measureUnitName"></el-table-column>
            </el-table>
          </el-tab-pane>
          <!--关键参数登记  -->
          <el-tab-pane label="关键参数登记" name="keyParams">
            <div style="margin: 3px 0;">
              <span>请选择量程：</span>
              <el-select v-model="ruleForm.rangeId" placeholder="请选择" :collapse-tags="true" style="width: 110px;"
                @change="queryParams">
                <el-option v-for="item in newRangeList" :key="item.rangeUid" :label="item.rangeName"
                  :value="item.rangeUid"></el-option>
              </el-select>
            </div>
            <el-alert
    title="请填写上限，下限；只允许录入数字"
    type="warning"
    show-icon :closable="false">
  </el-alert>
            <el-form class="keyParams_form" :model="keyParamsForm" ref="keyParamsForm" label-width="100px">
              <el-form-item v-for="(item,index) in ParamsList" :label="item.paramName" :key="item.id"
                class="keyparams_style">
                <span>上限:</span>
                <el-input v-model.number="addForm[index].paramUpperLimit" type="number"></el-input>
                <span>下限:</span>
                <el-input v-model.number="addForm[index].paramLowerLimit" type="number"
                  @change="paramLimitChange(index)"
                  :disabled="addForm[index].paramUpperLimit==''?true:addForm[index].paramUpperLimit==''"></el-input>
                <span>{{item.measureUnitName}}</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleRecordSave" v-if="flagEdit==1" disabled>备案</el-button>
        <el-button type="primary" @click="handleRecordSave" v-else>备案</el-button>
      </span>
    </el-dialog>
    <!-- 量程登记表点击新增弹出模态框 -->
    <el-dialog title="新增" :visible.sync="saveDialog" width="568px" :before-close="handleClose1"
      :close-on-click-modal="false">
      <el-form :model="saveForm" ref="saveForm" :rules="saveRules" label-width="100px">
        <div>
          <el-form-item label="名称:" prop="rangeId" class="form_style">
            <el-input v-model="saveForm.rangeId"></el-input>
          </el-form-item>
          <el-form-item label="量程单位:" class="form_style">
            <el-select v-model="saveForm.unit" placeholder="请选择" :collapse-tags="true">
              <el-option v-for="item in unitList" :key="item.measureUnitUid" :label="item.measureUnitName"
                :value="item.measureUnitUid"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="关键参数:" prop="keyParams" class="form_style">
            <el-select v-model="saveForm.keyParams" :multiple="true" placeholder="请选择" :collapse-tags="true">
              <el-option v-for="item in keyParamsList" :key="item.paramCode" :label="item.paramName"
                :value="item.paramCode" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="下限:" prop="low" class="form_style">
            <el-input v-model.number="saveForm.low" type="number"></el-input>
          </el-form-item>
          <el-form-item label="上限:" prop="upper" class="form_style">
            <el-input v-model.number="saveForm.upper" type="number"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="handleSave('saveForm')">确定</el-button>
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
  import { getLocalstorage, getUrlParams } from '../js/utils';
  import '../scss/globel.scss'
  import MutiSelect from '../components/MutiSelect.vue'
  import MultiCheckBox from '../components/MultiCheckBox.vue'
  export default {
    components: {
      MutiSelect,
      MultiCheckBox
    },
    name: "RecordTable",
    data() {
      return {
        loading: false,
        // 查询条件
        form: {                     // 表单数据
          selectValue: [],//检测项目
          pointOption: [],//点位
          newFactors: [],
          newPoint: [],
        },
        pointData: [],              // 点位数据
        factorList: [],             // 因子下拉数据
        value1: true,
        tableData: [],
        tableDataRight: [],
        // tab栏切换
        // 量程范围登记
        ruleForm: {
          newPointId: '',
          pointName: [],//水站名称
          company: '',
          rangeId: '',//量程
          values: '',//量程值
          factorId: '',
          analyze: ''
        },
        rules: {
          newPointId: [
            { required: true, message: '请选择水站名称', trigger: ['change', 'blur'] },
          ],
          company: [
            { required: true, message: '请输入运营单位', trigger: 'blur' },
          ],
          factorId: [
            { required: true, message: '请选择监测因子', trigger: 'change' },
          ],
          analyze: [
            { required: true, message: '请选择分析方法', trigger: 'change' },
          ],
        },
        // newPointId: '',//备案弹出框水站名称
        newFactorId: '',//备案弹出框因子
        analyzeList: [],//分析方法
        // statusList: [],//状态参数
        unitList: [],
        // 新增表单
        saveForm: {
          rangeId: '',//量程名
          upper: '',
          low: '',
          unit: '',
          isEnabled: '1',
          keyParams: []
        },
        saveRules: {
          rangeId: [
            { required: true, message: '请选择名称', trigger: 'change' },
          ],
          unit: [
            { required: true, message: '请选择单位', trigger: 'change' },
          ],
          keyParams: [
            { required: true, message: '请选择关键参数', trigger: 'change' },
          ],
          low: [
            { required: true, message: '请输入下限值', trigger: 'blur' },
          ],
          upper: [
            { required: true, message: '请输入上限值', trigger: 'blur' },
          ],
        },
        activeName: 'range',
        // rangeList: [],//字典表里的量程
        newRangeList: [],//通过点位和因子返回的量程
        ruleFormTableData: [],
        // 关键参数登记
        keyParamsForm: {},
        keyParamsList: [],//获取状态参数列表
        ParamsList: [],//根据量程查询其下参数
        addForm: [
          {
            id: '',//名称
            name: '',
            paramUpperLimit: '',
            paramLowerLimit: '',
            unit: ''
          }
        ],
        flagEdit: '',
        addFormError: false,
        // 分页
        currentPage: 1,
        pageSize: 30,
        total: 1,
        recordDialog: false,
        saveDialog: false,
        multipleSelection: [],
        exportName: [],//导出的点位名
        currentRow: null,
        flag: 1,
        base: window.API // 接口api地址
      };
    },
    watch: {
      ParamsList(newVal) {//量程每选一次，执行一次该方法
        if (newVal != null) {
          newVal.forEach((item, i) => {
            this.$set(this.addForm, i, {
              id: '',
              paramUpperLimit: '',
              paramLowerLimit: '',
            })
            this.addForm[i].id = item.id
            this.addForm[i].paramUpperLimit = item.paramUpperLimit
            this.addForm[i].paramLowerLimit = item.paramLowerLimit
          })
        }
      },
    },
    mounted() {
      this.getPoints()
      this.getFactors()
      this.getUnitList()
      // this.getRangeList()
    },

    methods: {
      // 判断是否是一个数字
      _checkNumber(n) {
        // 判断是否为数字
        let reg = /^[-+]?([0-9]+)([.]([0-9]+))?$/;
        return reg.test(n)
      },
      // 表格数据
      getPage() {
        this.tableDataRight = []
        this.loading = true
        var obj = {
          factorCodeList: this.form.selectValue,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          pointIdList: this.form.pointOption
        }
        this.$axios({
          url: `${this.base}/paramRecord/queryParamRecordList`,
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(obj)
        }).then(res => {
          this.loading = false
          this.tableData = res.data.data.records.map(item => {
            return {
              id: item.id,
              pointName: item.pointName,
              pointId: item.pointId,
              factorName: item.factorName,
              rangeName: item.rangeName,
              upperRangeLimit: item.upperRangeLimit,
              lowerRangeLimit: item.lowerRangeLimit,
              measureUnitName: item.measureUnitName,
              useOrNot: item.useOrNot == 1 ? true : false
            }
          })
          this.total = res.data.data.total
          this.$refs.tableDataRef.setCurrentRow(this.tableData[0])
          this.handleRowClick(this.tableData[0])
        }).catch(err => {
          console.log(err);
          this.loading = false
        })
      },
      // 备案
      handleRecord() {
        this.recordDialog = true
        console.log(this.ruleForm.newPointId);
        console.log(this.factorList[0].factorCode);//第一个因子id
      },
      // 点击表格的一行
      handleRowClick(row) {
        this.ruleForm.rangeId = row.id
        this.ruleForm.factorId = this.factorList.filter(item => item.factorName == row.factorName).map(item => item.factorCode).toString()
        this.queryParams()
      },
      // tab切换
      handleClick(tab) {
        console.log(tab);
        if (this.activeName == 'keyParams') {//关键参数登记
          console.log(this.ruleForm.rangeId);
          this.ruleForm.rangeId = ''
          this.getParamsList()
          this.queryParams(this.ruleForm.rangeId)
        }
      },
      // 量程范围登记
      handleAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveDialog = true
          } else {
            return false;
          }
        });
      },
      // 保存量程范围登记
      handleSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var value = this.saveForm.low - this.saveForm.upper
            if (value > 0) {
              this.$message({ type: 'warning', message: '下限值不能大于上限值' })
            } else {
              let userId = getLocalstorage('UserId') || getUrlParams(window.location.href).UserGuid || '066a6cf9-4518-4cca-b924-1bb172b8aea4'
              var keyParams = this.saveForm.keyParams.map(item => {
                return { paramCode: item }
              })
              var obj = {
                pointId: this.ruleForm.newPointId,//水站名称
                operationCompany: this.ruleForm.company,//运营单位
                factorCode: this.ruleForm.factorId,//监测因子
                analysisMethodUid: this.ruleForm.analyze,//分析方法
                rangeName: this.saveForm.rangeId,//量程名称
                measureUnitUid: this.saveForm.unit,//单位
                rangeParamList: keyParams,//关键参数
                lowerRangeLimit: this.saveForm.low,
                upperRangeLimit: this.saveForm.upper,
                userUid: userId
              }

              this.$axios({
                url: `${this.base}/paramRecord/addRange`,
                method: 'post',
                headers: {
                  'content-type': 'application/json',//添加请求头
                },
                data: JSON.stringify(obj)
              }).then(res => {
                if (res.data.code == 500) {
                  this.$message({ type: 'warning', message: res.data.msg })
                } else {
                  this.$message({ type: 'success', message: res.data.msg })
                  this.getPage()
                  this.handleClose1()
                  this.queryRangeByFactor()
                }

              }).catch(err => {
                console.log(err);
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 是否启用
      handleEnabled(row) {
        // 判断一下，同一站点同一个因子下是否有启用的量程
        if (row.useOrNot) {//当前行点击已启用，判断
          var arr = this.tableData.filter(item => {//过滤出相同点位相同因子的数组
            if (item.pointName == row.pointName && item.factorName == row.factorName) {
              return item
            }
          }).map(ite => ite.useOrNot)
          var newArr = arr.filter(arrItem => arrItem == true).map(ite => ite)
          if (newArr.length > 1) {//同一点位下同一因子已有启用的量程
            this.$message({ type: 'warning', message: '同一站点下同一个因子只能启用一个量程！' })
            this.getPage(row)
          } else {//同一点位下同一因子未有启用的量程
            this.enabled(row)
          }
        } else {//当前行点位未启用时直接调用启用接口
          this.enabled(row)
        }
      },
      enabled(row) {
        var useOrNot = ''
        let userId = getLocalstorage('UserId') || getUrlParams(window.location.href).UserGuid || '066a6cf9-4518-4cca-b924-1bb172b8aea4'
        if (row.useOrNot) {
          useOrNot = 1
        } else {
          useOrNot = 0
        }
console.log(useOrNot);
        var obj = {
          factorCode: row.factorCode,
          id: row.id,
          pointId: row.pointId,
          useOrNot: useOrNot,
          userUid: userId
        }
        this.$axios({
          url: `${this.base}/paramRecord/editRangeUseOrNot`,
          method: 'post',
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify(obj)
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({ type: 'success', message: '已修改启用状态' })
            this.getPage()
          } else {
            this.$message({ type: 'danger', message: '启用失败！' })
          }
        }).catch(err => {
          console.log(err);
          this.$message({ type: 'danger', message: '启用失败！' })

        })
      },
      // 备案模态框保存
      handleRecordSave() {
        if (this.addFormError) {
          this.$message({ type: 'warning', message: '备案失败' })
        } else {
          var newForm = []
          let userId = getLocalstorage('UserId') || getUrlParams(window.location.href).UserGuid || '066a6cf9-4518-4cca-b924-1bb172b8aea4'
          newForm.push({
            rangeParamList: this.addForm,
            rangeUid: this.ruleForm.rangeId,
            userUid: userId
          })
         
          this.$axios({
            url: `${this.base}/paramRecord/editParam`,
            method: 'post',
            headers: {
              'content-type': 'application/json;charset=UTF-8',//添加请求头
            },
            data: JSON.stringify(newForm[0])
          }).then(res => {
            if (res.data.code == 200) {
              this.queryRangeByFactor()
              this.$message({ type: 'success', message: '备案成功！' })
              this.handleClose()
              this.getPage()
            } else {
              this.getPage()
              this.$message({ type: 'danger', message: res.data.msg })
            }
          }).catch(err => {
            console.log(err);
            this.getPage()
            this.$message({ type: 'danger', message: err.data.msg })
          })
        }

      },
      // 获取点位数据
      getPoints() {
        let userId = getLocalstorage('UserId') || getUrlParams(window.location.href).UserGuid || '066a6cf9-4518-4cca-b924-1bb172b8aea4'
        this.$axios({
          method: "get",
          url: `${this.base}/paramRecord/getPointList`,
          params: { userUid: userId },
        }).then(res => {
          this.pointData = res.data.data
          // 备案弹出框水站名称：默认第一个
          // this.ruleForm.pointName = []//弹出框默认展示的
          this.form.pointOption = []//首页默认展示的
          // this.ruleForm.newPointId = ''
          this.form.pointOption.push(this.pointData[0].children[0].id)
          // this.ruleForm.pointName.push(this.pointData[0].children[0].id)
          // this.ruleForm.newPointId = this.pointData[0].children[0].id
          this.form.newPoint = this.form.pointOption.map(item => item)
          this.getPage()
          this.handlePointChangeData()
        }).catch(err => {
          console.log(err);
        })
      },
      // 获取因子下拉数据
      getFactors() {
        this.$axios({
          method: "get",
          url: `${this.base}/paramRecord/queryFactorList`,
        }).then(res => {
          this.factorList = res.data.data
          this.form.selectValue = []
          // 首页因子默认全选
          this.form.selectValue = this.factorList.map(item => item.factorCode)
          // 备案弹出框默认展示第一个
          this.ruleForm.factorId = ''
          this.ruleForm.factorId = this.factorList[0].factorCode
          this.newFactorId = ''
          this.newFactorId = this.factorList[0].factorCode
        }).catch(err => {
          console.log(err);
        })
      },

      // 获取分析方法
      getAnalyzeList() {
        console.log(this.ruleForm.newPointId);
        console.log(this.ruleForm.factorId);
        var obj={
          pointId:this.ruleForm.newPointId,
          factorCode:this.ruleForm.factorId
        }
        this.$axios({
          url: `${this.base}/paramRecord/queryAnalyticalMethod`,
          method: 'get',
          params:obj
        }).then(res => {
          // console.log(res);
          this.analyzeList = []
          // console.log(res.data.data);
          if(res.data.data!=null){
            this.analyzeList.push(res.data.data)
            this.ruleForm.analyze = ''
          this.ruleForm.analyze = this.analyzeList[0].analysisMethodUid
          }else {
            this.analyzeList=this.analyzeList.map(item=>{
              console.log(item);
              return {
                analysisMethodUid:'',
                analysisMethodName:''
              }
            })
          }
          // console.log(this.analyzeList);
        
         
        }).catch(err => {
          console.log(err);
        })
      },
      // 获取量程单位
      getUnitList() {
        this.$axios.get(`${this.base}/paramRecord/queryRangeUnitList`).then(res => {
          this.unitList = res.data.data
        }).catch(err => {
          console.log(err);
        })
      },
      // 获取量程下拉
      /*  getRangeList() {
         this.$axios.get(`${this.base}/paramRecord/queryRangeList`).then(res => {
           this.rangeList = res.data.data
         }).catch(err => {
           console.log(err);
         })
       }, */
      // 选择备案弹出框的名称和因子调用
      handleRange(val1) {
        this.ruleForm.newPointId = val1
        this.queryDept(val1)
        this.queryRangeByFactor();
        this.getParamsList(this.factorList[0].factorCode);
        this.getAnalyzeList()

      },
      // 根据点位pid获取运维商信息
      queryDept(test) {
        this.$axios({
          url: `${this.base}/paramRecord/queryDept`,
          method: 'get',
          params: { pointId: test }
        }).then(res => {
          this.ruleForm.company = res.data.data;
        }).catch(err => {
          console.log(err);
        })
      },
      handleFactor(val2) {
        this.newFactorId = val2
        this.queryRangeByFactor()
        this.getParamsList(val2)
      this.getAnalyzeList()

      },
      // 根据点位和因子查询量程
      queryRangeByFactor() {
        var obj = {
          pointId: this.ruleForm.newPointId,
          factorCode: this.newFactorId
        }
        this.$axios({
          url: `${this.base}/paramRecord/queryRangeByFactor`,
          method: 'get',
          params: obj
        }).then(res => {
          this.ruleFormTableData = res.data.data
          this.newRangeList = (res.data.data || []).map(item => {
            return {
              rangeUid: item.rangeUid,
              rangeName: item.rangeName,
              flagEdit: item.flagEdit
            }
          })
          this.ruleForm.rangeId = ''
        }).catch(err => {
          console.log(err);
        })
      },
      // 根据量程查询其下参数
      queryParams(data, id) {
        console.log(id);
        // factorCode:关键参数中的因子id
        this.$axios({
          url: `${this.base}/paramRecord/queryParamByRangeUid`,
          method: 'get',
          params: {
            rangeUid: this.ruleForm.rangeId,
            factorCode: this.ruleForm.factorId
          }
        }).then(res => {
          // 右侧列表
          this.tableDataRight = res.data.data
          //该参数是否编辑过
          this.flagEdit = ''
          var str = this.newRangeList.filter(item => {
            return item.rangeUid == data
          }).map(ite => {
            return ite.flagEdit
          })
          this.flagEdit = str.toString()          //参数列表
          this.ParamsList = res.data.data
        }).catch(err => {
          console.log(err);
        })
      },
      // 获取关键参数/状态参数列表
      getParamsList() {
        this.$axios({
          url: `${this.base}/paramRecord/queryParamList`,
          method: 'get',
          params: { factorCode: this.ruleForm.factorId }
        }).then(res => {
          this.keyParamsList = res.data.data
          this.saveForm.keyParams = this.keyParamsList.map(item => item.paramCode)
        
        }).catch(err => {
          console.log(err);
        })
      },

      handlePointChangeData(val) {
        if (val) {
          this.form.pointOption = []
          this.exportName = []
          this.form.pointOption = val.map(item => item.id)
          this.exportName = val.map(item => item.title)
        
        } else {
          console.log('err');
        }

      },
      paramLimitChange(index) {
        if (this.addForm[index].paramUpperLimit - this.addForm[index].paramLowerLimit < 0) {
          this.$message({ type: 'warning', message: '下限不能超过上限' })
          this.addFormError = true
        } else {
          this.addFormError = false
        }
      },
      // 分页
      handleSizeChange(val) {
        this.pageSize = val
        this.getPage()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getPage()
      },
      handleCurrentChange2(val) {
        this.currentRow = val;
      },
      // 表格索引
      _index(idx) {
        return (this.currentPage - 1) * this.pageSize + (idx + 1)
      },
      handleClose() {
        this.recordDialog = false
        this.activeName = 'range'
        // this.$refs.ruleForm.resetFields()
        this.ruleForm.newPointId=''
        this.ruleForm.company = ''
        this.ruleForm.rangeId = ''
        this.ruleForm.analyze = ''
        this.ruleForm.factorId = ''
        this.ruleFormTableData=[]
        this.ruleForm.factorId = this.factorList[0].factorCode
      },
      handleClose1() {
        this.saveDialog = false
        this.saveForm.unit = ''
        this.$refs.saveForm.resetFields(); //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.saveForm.clearValidate();//这个是移除表单项的校验结果
      },
      // 删除量程
      handleDelete(ids, index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (ids == 'uid') {//首页删除，传id
            this.del(this.multipleSelection.toString(), ids)
          } else {//备案表弹出框列表删除
            this.del(row.rangeUid, ids)

          }
          /*  */

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      del(delIds, ids) {
        this.$axios({
          url: `${this.base}/paramRecord/batchDeleteRange`,
          method: 'delete',
          params: { ids: delIds }
        }).then(res => {
          console.log(res);
          if (ids == 'uid') {
            this.getPage()
          } else {
            this.queryRangeByFactor()
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'danger',
            message: '删除失败!'
          });
        })
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
        this.multipleSelection = [];
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      },
      //导出
      exportTable() {
        var dates = this.getDates()
        console.log(this.ruleForm);
        var obj = {
          factorCodeList: this.form.selectValue,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          pointIdList: this.form.pointOption
        }
        this.$axios({
          url: `${this.base}/paramRecord/exportParamRecordData`,
          method: 'post',
          headers: {
            'content-type': 'application/json;charset=UTF-8',//添加请求头
          },
          data: JSON.stringify(obj),
          responseType: 'blob'
        }).then(res => {
          console.log(res);
          if (res.status == 200) {
            const BLOB = res.data; // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
            const fileReader = new FileReader(); // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
            fileReader.readAsDataURL(BLOB); // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
            fileReader.onload = (event) => { // 处理load事件。该事件在读取操作完成时触发
              // 新建个下载的a标签，完成后移除。
              let a = document.createElement('a');
              a.download = this.exportName.toString() + ' ' + dates + `.xlsx`;
              a.href = event.target.result;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
            // this.$message({ type: 'success', message: '导出成功！' })
          } else {
            this.$message({ type: 'danger', message: '导出失败！' })
          }
        }).catch(err => {
          console.log(err);
          this.$message({ type: 'danger', message: '导出失败！' })
        })
      },
      getDates() {
        var newDate = new Date()
        var year = newDate.getFullYear()
        var month = newDate.getMonth() + 1
        month = month < 10 ? '0' + month : month
        var dd = newDate.getDate()
        dd = dd < 10 ? '0' + dd : dd
        var hour = newDate.getHours()
        hour = hour < 10 ? '0' + hour : hour
        var m = newDate.getMinutes()
        m = m < 10 ? '0' + m : m
        return year + '-' + month + '-' + dd + ' ' + hour + ':' + m
      },

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
    /* color: red; */
    padding: 2px 0 5px 0;
  }

  .keyparams_style .el-input {
    width: 110px;
    margin: 0 20px;
  }

  .el-tag__close {
    display: none !important;
  }
</style>
