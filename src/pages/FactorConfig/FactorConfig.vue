<template>
  <div id="app">
    <div class="header">
      <div class="btmGroup">
        <el-button
          type="success"
          @click="add"
          icon="el-icon-circle-plus-outline"
          size="mini"
        >新增</el-button>
        <el-button
          type="danger"
          @click="del"
          icon="el-icon-remove-outline"
          size="mini"
        >删除</el-button>
      </div>
      <div class="query">
        <div class="select">
          <span>选择因子：</span>
          <el-select v-model="factorValue" placeholder="请选择" filterable clearable>
            <!-- <el-option label="所有选项" value=""></el-option> -->
            <el-option
              v-for="item in factorList"
              :key="item.standardFactorUid"
              :label="item.factorName"
              :value="item.standardFactorUid">
            </el-option>
          </el-select>
        </div>
        <el-button class="btn" type="primary" @click="search">查找</el-button>
      </div>
    </div>
    <div class="body">
      <el-table 
        :data="tableList" 
        stripe
        size="mini"
        @selection-change="handleSelectionChange"
        height="calc(100% - 10px)">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column 
          v-for="(item) in label" :key="item.title"
          :label="item.title"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          align="center"
          min-width="150px"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 新增、编辑 -->
    <el-dialog
      title="新增"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="400px"
    >
      <el-form ref="form" label-width="80px" size="mini" :model="configMsg" :rules="rules" class="editForm">
        <el-form-item label="因子" style="width:100%" prop="factor">
          <el-select v-model="configMsg.factor" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in factorList"
              :key="item.standardFactorUid"
              :label="item.factorName"
              :value="item.standardFactorUid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行开始时间" style="width:100%" prop="strTime">
          <el-date-picker
            v-model="configMsg.strTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="执行结束时间" style="width:100%" prop="endTime">
          <el-date-picker
            v-model="configMsg.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="浓度上限" style="width:100%" prop="concentrationUpperValue">
          <el-input type="number" min="0" v-model="configMsg.concentrationUpperValue"></el-input>
        </el-form-item>
        <el-form-item label="浓度下限" style="width:100%" prop="concentrationLowerValue">
          <el-input type="number" min="0" v-model="configMsg.concentrationLowerValue"></el-input>
        </el-form-item>
        <el-form-item label="偏差类型" style="width:100%" prop="deviation">
          <el-select v-model="configMsg.deviation" placeholder="请选择">
            <el-option
              v-for="item in deviationList"
              :key="item.deviationTypeUid"
              :label="item.deviationTypeName"
              :value="item.deviationTypeUid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="偏差上限" style="width:100%" prop="deviationUpperValue">
          <el-input type="number" min="0" v-model="configMsg.deviationUpperValue"></el-input>
        </el-form-item>
        <el-form-item label="偏差下限" style="width:100%" prop="deviationLowerValue">
          <el-input type="number" min="0" v-model="configMsg.deviationLowerValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="save('form')">提交</el-button>
        <el-button type="primary" @click="reset('form')" >取消</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[15, 20, 30]"
        :page-size="size"
        style="float:right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data: function(){
    const check = (rule, value, callback)=>{
      if(value.length === 0){
        return callback(new Error('请选择状态参数'));
      }else {
        callback();
      }
    }
    return {
      factorList: [],
      factorValue: '',
      deviationList: [],
      label: [],
      tableList: [],
      total: 0,
      page: 0,
      size: 15,
      dialogVisible: false,
      multipleSelection: '',
      configMsg: {
        factor: '',
        strTime: '',
        endTime: '',
        concentrationUpperValue: '',
        concentrationLowerValue: '',
        deviation: '',
        deviationUpperValue: '',
        deviationLowerValue: ''
      },
      rules: {
        contaminants: [
          { required: true, message: '请选择监测污染物', trigger: 'change' },
        ],
        state: [
          { required: true, validator: check, trigger: 'blur'},
        ],
        upperValue: [
          { required: true, message: '请输入参考默认上限', trigger: 'blur' },
          { max: 5, message: '长度需小于50个字符', trigger: 'blur' }
        ],
        lowerValue: [
          { required: true, message: '请输入选择参考默认上限', trigger: 'blur' },
          { max: 5, message: '长度需小于50个字符', trigger: 'blur' }
        ],
      },
      delId: '',
      baseUrl: window.configUrl
    }
  },
  mounted: function(){
    this.getFactorList();
    this.getDeviationList();
  },
  methods: {
    indexMethod(index) {
      return index+1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页条件
    handleSizeChange(val){
      this.size = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableList();
    },
    //关闭弹出框
    handleClose(done) {
      this.$refs["form"].resetFields();
      done();
    },
    // 获取选择因子
    getFactorList(){
      let url = this.baseUrl + '/weekQuality/queryWeekFactorList';
      this.$axios.get(url).then(res => {
        if(res.status == 200){
          if(res.data.code == 200){
            this.factorList = res.data.data;
            this.getTableList();
          }
        }
      })
    },
    // 获取偏差类型
    getDeviationList(){
      let url = this.baseUrl + '/weekQuality/queryDeviationTypeList';
      this.$axios.get(url).then(res => {
        if(res.status == 200){
          if(res.data.code == 200){
            this.deviationList = res.data.data;
          }
        }
      })
    },
    // 获取表格数据
    getTableList(){
      let url = this.baseUrl + '/weekQuality/queryStandardLimit';
      let obj = {
        standardFactorUid: this.factorValue,
        pageNo: this.page,
        pageSize: this.size
      }
      this.$axios.get(url,{
        params: obj
      }).then(res => {
        console.log(res)
        if(res.status == 200){
          if(res.data.code == 200){
            let val = res.data.data;
            this.total = val.total;
            this.size = val.size;
            this.page = val.current;
            this.tableList = val.records;
            let _tableList = {
              factorCode: '污染物编号',
              factorName: '污染物因子',
              unit: '量纲',
              executeStartTime: '执行开始时间',
              executeEndTime: '执行结束时间',
              densityUpper: '浓度上限',
              densityLow: '浓度下限',
              deviationTypeName: '偏差类型',
              deviationUpper: '偏差下限',
              deviationLow: '偏差上限'
            };
            let labelList=Object.entries(_tableList);
            this.label=labelList.map(function(item){
              return {
                title:item[1],
                prop:item[0]
              };
            });
          }
        }
      })
    },
    // 查询
    search(){
      this.page = 1;
      this.getTableList();
    },
    // 新增
    add(){
      this.dialogVisible = true;
      let obj = {
        factor: '',
        strTime: '',
        endTime: '',
        concentrationUpperValue: '',
        concentrationLowerValue: '',
        deviation: '',
        deviationUpperValue: '',
        deviationLowerValue: ''
      };
      this.configMsg = obj;
    },
    // 删除
    del(){
       if(this.multipleSelection.length===0){
        alert("请选择想要删除项！");
        return false;
      }
      var arr=[];
      this.multipleSelection.forEach((item)=>{
        arr.push(item.id);
      });
      this.delId=arr.join(",");
      this.$confirm('确定要删除吗?').then(()=>{
        console.log(this.delId)
        this.handleDel();
      }).catch(()=>{});
    },
    async handleDel(){
      var url = this.baseUrl + '/weekQuality/batchDeleteStandardLimit';
      try{
        var res=await this.$axios.delete(url,{
          params:{
            ids:this.delId
          }
        });
        if(res.data.code==200){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        }else if(res.data.code == 500){
          this.$message.error(res.data.msg);
        }
        this.delId ="";
        this.getTableList();
      }catch(e){
        console.log(e)
      }
    },
    // 新增保存
    save(formName){
      let url = this.baseUrl + '/weekQuality/addStandardLimitSave';
      let obj = {
        userUid: '39bd85ac-55e7-431e-9fa7-a217dcea23bf',
        standardFactorUid: this.configMsg.factor,
        executeStartTime: this.configMsg.strTime,
        executeEndTime: this.configMsg.endTime,
        densityUpper: this.configMsg.concentrationUpperValue,
        densityLow: this.configMsg.concentrationLowerValue,
        deviationTypeUid: this.configMsg.deviation,
        deviationUpper: this.configMsg.deviationUpperValue,
        deviationLow: this.configMsg.deviationLowerValue
      }
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$confirm('确认提交？').then(()=>{
            console.log(obj)
            this.$axios.post(url,obj).then(res => {
              console.log(res)
              if(res.data.code==200){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.getTableList();
                this.dialogVisible = false;
                this.$refs[formName].resetFields();
              }else if(res.data.code == 500){
                this.$message.error(res.data.msg);
              }
            });
          });
        }
      });
    },
    // 取消
    reset(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
  }
}
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
  display:flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
/* 头部查询 */
.header {
  display: flex;
  justify-content: space-between;
  margin: 10px 5px;
  height: 30px;
}
.btmGroup {
  padding-left: 10px;
}
.query {
  display: flex;
  width: 700px;
}
.select{
  display:flex;
  margin-left: 300px;
  width:300px;
  font-size: 14px;
}
.select>span{
  display: inline-block;
  width:100px;
  text-align: center;
  line-height: 30px;
}
.select>.el-input{
  width:220px !important;
}
.body {
  flex: 1;
}
/* 新增、编辑 */
.el-dialog__header {
  background-color: #cecece;
}
.el-form-item__label {
  width: 110px !important;
}
.el-form-item__content>.el-input {
  width: 69% !important;
}
.el-form-item__error {
  left: 14% !important;
}
.page {
  padding-right: 5px;
  padding-bottom: 5px;
}
</style>