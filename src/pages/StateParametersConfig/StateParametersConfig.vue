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
        >禁用</el-button>
      </div>
      <div class="query">
        <div class="select">
          <span>指标类型：</span>
          <el-select v-model="indexValue" placeholder="请选择" filterable clearable>
            <!-- <el-option label="所有选项" value=""></el-option> -->
            <el-option
              v-for="item in indexList"
              :key="item.itemValue"
              :label="item.itemText"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <el-input v-model="factorValue" placeholder="关键字（状态参数编码，状态参数名称）" clearable></el-input>
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
      :title="addFlag?'新增':'编辑'"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="700px"
    >
      <el-form ref="form" label-width="80px" size="mini" :model="indexMsg" :rules="rules" class="editForm">
        <el-form-item label="状态参数编码" style="width:49%" prop="paramCode">
          <el-input v-model="indexMsg.paramCode" placeholder="请输入状态参数编码" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="状态参数名称" style="width:49%" prop="paramName">
          <el-input v-model="indexMsg.paramName" placeholder="请输入状态参数名称" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="指标类型" style="width:49%" prop="typeName">
          <el-select v-model="indexMsg.typeName" placeholder="请选择" filterable>
            <el-option
              v-for="item in indexList"
              :key="item.itemValue"
              :label="item.itemText"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计量单位" style="width:49%" prop="measureUnitName">
          <el-select v-model="indexMsg.measureUnitName" placeholder="请选择">
            <el-option
              v-for="item in measurementList"
              :key="item.itemValue"
              :label="item.itemText"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认小数位" style="width:49%" prop="decimalNumber">
          <el-input type="number" min="0" oninput="if(value.length>10)value=value.slice(0,10)" v-model="indexMsg.decimalNumber"></el-input>
        </el-form-item>
        <el-form-item label="是否使用" style="width:49%" prop="flagEnable">
          <el-tooltip :content="indexMsg.flagEnable" placement="top">
            <el-switch
              v-model="indexMsg.flagEnable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="是"
              inactive-value="否">
            </el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="排序" style="width:49%" prop="sortNumber">
          <el-input type="number" min="0" oninput="if(value.length>5)value=value.slice(0,5)" v-model="indexMsg.sortNumber"></el-input>
        </el-form-item>
        <el-form-item label="描述" style="width:100%">
          <el-input type="textarea" :rows="2" v-model="indexMsg.description" placeholder="请输入描述" maxlength="500" show-word-limit></el-input>
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
    return {
      indexList: [],
      indexValue: '',
      factorValue: '',
      measurementList: [],
      label: [],
      tableList: [],
      indexMsg: {
        paramCode: '',
        paramName: '',
        typeName: '',
        measureUnitName: '',
        decimalNumber: '',
        flagEnable: '否',
        sortNumber: '',
        description: ''
      },
      total: 0,
      page: 0,
      size: 15,
      addFlag: true,
      dialogVisible: false,
      multipleSelection: '',
      rules: {
        paramCode: [
          { required: true, message: '请输入状态参数编码', trigger: 'blur' },
        ],
        paramName: [
          { required: true, message: '请输入状态参数名称', trigger: 'blur' },
        ],
        typeName: [
          { required: true, message: '请选择指标类型', trigger: 'change' },
        ],
        measureUnitName: [
          { required: true, message: '请选择计量单位', trigger: 'change' },
        ],
      },
      delId: '',
      upDateId: '',
      baseUrl: window.API
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
    //关闭弹出框
    handleClose(done) {
      this.$refs["form"].resetFields();
      done();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableList();
    },
    // 获取指标类型
    getIndexList(){
      this._publicFun('状态参数指标类别').then(res => {
        this.indexList = res;
        console.log(res)
        this.getTableList();
      })
    },
    // 获取计量单位
    getMeasurementList(){
      this._publicFun('状态参数计量单位').then(res => {
        this.measurementList = res;
      })
    },
    // 获取表格数据
    getTableList(){
      let url = this.baseUrl + '/stateParam/page';
      let obj = {
        typeCode: this.indexValue,
        keyword: this.factorValue,
        pageNo: this.page,
        pageSize: this.size
      }
      this.$axios.get(url,{
        params: obj
      }).then(res => {
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
              paramCode: '状态参数编码',
              paramName: '状态参数名称',
              typeName: '指标类别',
              measureUnitName: '计量单位',
              decimalNumber: '默认小数位',
              flagEnable: '是否使用',
              sortNumber: '排序值'
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
        console.log(res)
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
      this.addFlag = true;
      let obj = {
        paramCode: '',
        paramName: '',
        typeName: '',
        measureUnitName: '',
        decimalNumber: '',
        flagEnable: '否',
        sortNumber: '',
        description: ''
      };
      this.indexMsg = obj;
    },
    // 编辑
    edit(row){
      let url = this.baseUrl + '/stateParam/getById';
      this.dialogVisible = true;
      this.addFlag = false;
      this.$axios.get(url,{
        params: {
          id: row.id
        }
      }).then(res => {
        console.log(res)
        if(res.status == 200){
          if(res.data.code == 200){
            let list = res.data.data
            this.indexMsg.paramCode = list.paramCode;
            this.indexMsg.paramName = list.paramName;
            this.indexMsg.typeName = list.typeCode;
            this.indexMsg.measureUnitName = list.measureUnit;
            this.indexMsg.decimalNumber = list.decimalNumber;
            if(list.flagEnable === 0){
              this.indexMsg.flagEnable = "否";
            }else if(list.flagEnable == 1){
              this.indexMsg.flagEnable = "是";
            }
            this.indexMsg.sortNumber = list.sortNumber;
            this.indexMsg.description = list.description;
            this.upDateId = list.id;
          }
        }
      })
    },
    // 删除
    del(){
       if(this.multipleSelection.length===0){
        alert("请选择想要禁用项！");
        return false;
      }
      var arr=[];
      this.multipleSelection.forEach((item)=>{
        arr.push(item.id);
      });
      this.delId=arr.join(",");
      this.$confirm('确定要禁用吗?').then(()=>{
        console.log(this.delId)
        this.handleDel();
      }).catch(()=>{});
    },
    async handleDel(){
      let url = this.baseUrl + '/stateParam/batchDelete';
      try{
        let res=await this.$axios.delete(url,{
          params:{
            ids:this.delId
          }
        });
        console.log(res)
        if(res.data.code==200){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        }else if(res.data.code == 500){
          this.$message.error(res.data.msg);
        }
        this.delId = "";
        this.getTableList();
      }catch(e){
        console.log(e)
      }
    },
    // 保存
    save(formName){
      let url = this.baseUrl + '/stateParam/save';
      let flag;
      if(this.indexMsg.flagEnable == "是"){
        flag = 1
      }else if(this.indexMsg.flagEnable == "否"){
        flag = 0;
      }
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$confirm('确认提交？').then(()=>{
            var obj = {
              id: this.upDateId,
              creator: 'test',
              modifier: 'test',
              paramCode: this.indexMsg.paramCode,
              paramName: this.indexMsg.paramName,
              typeCode: this.indexMsg.typeName,
              measureUnit: this.indexMsg.measureUnitName,
              decimalNumber: this.indexMsg.decimalNumber,
              flagEnable: flag,
              sortNumber: this.indexMsg.sortNumber,
              description: this.indexMsg.description
            };
            console.log(obj);
            this.$axios.post(url,obj).then(res => {
              console.log(res)
              if(res.data.code==200){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.getTableList();
                this.dialogVisible = false;
                this.upDateId = '';
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
    // 通用接口调用
    async _publicFun(val){
      let url = this.baseUrl + '/land/common/dictList';
      try {
        let res = await this.$axios.get(url,{
          params:{
            codeName: val
          }
        });
        if(res.status == 200){
          if(res.data.code == 200){
            return res.data.data;
          }
        }
      } catch(e) {
        console.log(e)
      }
    }
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
.select:nth-of-type(2)>.el-input{
  width:260px !important;
}
.body {
  flex: 1;
}
/* 新增、编辑 */
.editForm {
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-dialog__header {
  background-color: #cecece;
}
.el-form-item__label {
  width: 110px !important;
}
.el-form-item__content>.el-input {
  width: 86% !important;
}
.el-form-item__content>.el-select>.el-input{
  width: 109% !important;
}
.el-select-dropdown {
  min-width: 210px !important;
}
.el-textarea {
  width: 92% !important;
}
.el-form-item__error {
  left: 14% !important;
}
.page {
  padding-right: 5px;
  padding-bottom: 5px;
}
</style>