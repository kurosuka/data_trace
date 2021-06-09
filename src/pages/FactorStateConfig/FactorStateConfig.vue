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
          <span>监测污染物：</span>
          <el-select v-model="contaminantsValue" placeholder="请选择" filterable clearable>
            <!-- <el-option label="所有选项" value=""></el-option> -->
            <el-option
              v-for="item in contaminantsList"
              :key="item.factorCode"
              :label="item.factorName"
              :value="item.factorCode">
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <el-input v-model="factorValue" placeholder="关键字（因子编码，因子名称）" clearable></el-input>
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
        <el-table-column prop="" label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
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
      <el-form ref="form" label-width="80px" size="mini" :model="factorMsg" :rules="rules" class="editForm">
        <el-form-item label="监测污染物" style="width:100%" prop="contaminants">
          <el-select v-model="factorMsg.contaminants" placeholder="请选择" filterable>
            <el-option
              v-for="item in contaminantsList"
              :key="item.factorCode"
              :label="item.factorName"
              :value="item.factorCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态参数" style="width:100%" prop="state">
          <el-select v-model="factorMsg.state" placeholder="请选择" multiple collapse-tags>
            <el-option
              v-for="item in stateList"
              :key="item.paramCode"
              :label="item.paramName"
              :value="item.paramCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="saveNew('form')">提交</el-button>
        <el-button type="primary" @click="reset('form')" >取消</el-button>
      </span>
    </el-dialog> 
    <el-dialog
      title="编辑"
      style="text-align:left !important"
      :visible.sync="dialogVisible1"
      :before-close="handleClose1"
      width="400px"
    >
      <el-form ref="form" label-width="80px" size="mini" :model="limitDataMsg" :rules1="rules" class="editForm">
        <el-form-item label="监测污染物" style="width:100%" prop="factorName">
          <el-input v-model="limitDataMsg.factorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="因子编码" style="width:100%" prop="paramCode">
          <el-input v-model="limitDataMsg.paramCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="因子名称" style="width:100%" prop="paramName">
          <el-input v-model="limitDataMsg.paramName" disabled></el-input>
        </el-form-item>
        <el-form-item label="参考默认上限" style="width:100%" prop="upperValue">
          <el-input type="number" min="0" v-model="limitDataMsg.upperValue"></el-input>
        </el-form-item>
        <el-form-item label="参考默认下限" style="width:100%" prop="lowerValue">
          <el-input type="number" min="0" v-model="limitDataMsg.lowerValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="saveLimit('form')">提交</el-button>
        <el-button type="primary" @click="reset1('form')" >取消</el-button>
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
      contaminantsList: [],
      contaminantsValue: '',
      factorValue: '',
      stateList: [],
      label: [],
      tableList: [],
      total: 0,
      page: 0,
      size: 15,
      dialogVisible: false,
      dialogVisible1: false,
      multipleSelection: '',
      factorMsg: {
        contaminants: '',
        state: []
      },
      rules: {
        contaminants: [
          { required: true, message: '请选择监测污染物', trigger: 'change' },
        ],
        state: [
          { required: true, validator: check, trigger: 'blur'},
        ],
      },
      limitDataMsg: {
        factorName: '',
        paramCode: '',
        paramName: '',
        upperValue: '',
        lowerValue: '',
      },
      rules1: {
        upperValue: [
          { required: true, message: '请输入参考默认上限', trigger: 'blur' },
          { max: 50, message: '长度需小于50个字符', trigger: 'blur' }
        ],
        lowerValue: [
          { required: true, message: '请输入参考默认下限', trigger: 'blur' },
          { max: 50, message: '长度需小于50个字符', trigger: 'blur' }
        ],
      },
      title: [],
      updateId: '',
      delId: '',
      baseUrl: window.testUrl
    }
  },
  mounted: function(){
    this.getIndexList();
    this.getMeasurementList();
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
    handleClose1(done) {
      this.$refs["form"].resetFields();
      done();
    },
    
    // 获取监测污染物
    getIndexList(){
      let url = this.baseUrl + '/factor/stateParam/factorList';
      this.$axios.get(url).then(res => {
        if(res.status == 200){
          if(res.data.code == 200){
            this.contaminantsList = res.data.data;
            this.getTableList();
          }
        }
      })
    },
    // 获取状态参数
    getMeasurementList(){
      let url = this.baseUrl + '/stateParam/getList';
      this.$axios.get(url).then(res => {
        if(res.status == 200){
          if(res.data.code == 200){
            this.stateList = res.data.data;
          }
        }
      })
    },
    // 获取表格数据
    getTableList(){
      let url = this.baseUrl + '/factor/stateParam/page';
      let obj = {
        factorCode: this.contaminantsValue,
        keyword: this.factorValue,
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
            let list = val.records;
            let cloneList = JSON.parse(JSON.stringify(list));
            this.tableList = cloneList.map(item => {
              if(item.flagEnable === 0){
                item.flagEnable = '否';
              }else if(item.flagEnable == 1){
                item.flagEnable = '是';
              }
              return item;
            });
            let _tableList = {
              factorName: '监测污染物',
              paramCode: '因子编码',
              paramName: '因子名称',
              typeName: '指标类别',
              measureUnitName: '计量单位',
              decimalNumber: '默认小数位',
              upperValue: '参考默认上限',
              lowerValue: '参考默认下限',
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
        contaminants: '',
        state: ''
      };
      this.factorMsg = obj;
    },
    // 编辑
    edit(row){
      let url = this.baseUrl + '/factor/stateParam/getById';
      this.dialogVisible1 = true;
      this.$axios.get(url,{
        params: {
          id: row.id
        }
      }).then(res => {
        console.log(res)
        if(res.status == 200){
          if(res.data.code == 200){
            let list = res.data.data
            this.limitDataMsg.factorName = list.factorName;
            this.limitDataMsg.paramCode = list.paramCode;
            this.limitDataMsg.paramName = list.paramName;
            this.limitDataMsg.upperValue = list.upperValue;
            this.limitDataMsg.lowerValue = list.lowerValue;
            this.updateId = list.id;
          }
        }
      })
    },
    // 删除
    del(){
      if(this.multipleSelection.length===0){
        alert("请选择想要删除项！");
        return false;
      }
      let arr=[];
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
      let url = this.baseUrl + '/factor/stateParam/batchDelete';
      try{
        let res=await this.$axios.delete(url,{
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
    // 获取状态参数文字
    getTitle(){
      this.title = [];
      this.factorMsg.state.map(item => {
        let val;
        val = this.stateList.filter(list => {
          return list.paramCode == item;
        })
        this.title.push(val[0].paramName)
      })
    },
    // 新增保存
    saveNew(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$confirm('确认提交？').then(()=>{
            this.getTitle();
            console.log(this.title)
            let url = this.baseUrl + '/factor/stateParam/save';
            // let url = this.baseUrl + '';
            let newFormData = new FormData();
            newFormData.append('factorCode',this.factorMsg.contaminants);
            newFormData.append('userGuid','test');
            newFormData.append('paramCodes',this.factorMsg.state);
            newFormData.append('paramNames',this.title);
            console.log(this.factorMsg.state)
            // var obj = {
            //   factorCode: this.factorMsg.contaminants,
            //   userGuid: 'test',
            //   paramCodes: this.factorMsg.state,
            //   paramNames: 'test'
            // };
            this.$axios.post(url,newFormData).then(res => {
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
    // 新增上下限值
    saveLimit(formName){
      let url = this.baseUrl + '/factor/stateParam/updateValue';
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$confirm('确认提交？').then(()=>{
            var obj = {
              id: this.updateId,
              modifier: 'test',
              upperValue: this.limitDataMsg.upperValue,
              lowerValue: this.limitDataMsg.lowerValue,
            };
            this.$axios.post(url,obj).then(res => {
              console.log(res)
              if(res.data.code==200){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.getTableList();
                this.dialogVisible1 = false;
                this.updateId = '';
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
    reset1(formName){
      this.dialogVisible1 = false;
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
  width:300px;
  font-size: 14px;
}
.select>span{
  display: inline-block;
  width:100px;
  text-align: center;
  line-height:30px;
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
  width: 86% !important;
}
.el-form-item__error {
  left: 14% !important;
}
.page {
  padding-right: 5px;
  padding-bottom: 5px;
}
</style>