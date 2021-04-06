<template>
  <div id="app">
    <div class="header">
      <div>
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
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
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
      width="600px"
    >
      <el-form ref="form" label-width="80px" size="mini" :model="indexMsg" :rules="rules" class="editForm">
        <el-form-item label="因子编码" style="width:49%" prop="factor">
          <el-input v-model="indexMsg.factor" placeholder="请输入因子编码" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="因子名称" style="width:49%" prop="factorName">
          <el-input v-model="indexMsg.factorName" placeholder="请输入因子名称" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="指标类型" style="width:49%" prop="indexType">
          <el-select v-model="indexMsg.indexType" placeholder="请选择" filterable>
            <el-option
              v-for="item in indexList"
              :key="item.itemValue"
              :label="item.itemText"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计量单位" style="width:49%" prop="measurement">
          <el-select v-model="indexMsg.measurement" placeholder="请选择">
            <el-option
              v-for="item in measurementList"
              :key="item.itemValue"
              :label="item.itemText"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认小数位" style="width:49%" prop="decimal">
          <el-input type="number" v-model="indexMsg.decimal"></el-input>
        </el-form-item>
        <el-form-item label="排序" style="width:49%" prop="sortNumber">
          <el-input type="number" v-model="indexMsg.sortNumber"></el-input>
        </el-form-item>
        <el-form-item label="备注" style="width:100%">
          <el-input type="textarea" :rows="2" v-model="indexMsg.note" placeholder="请输入备注" maxlength="500"></el-input>
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
        :page-sizes="[5, 10, 20]"
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
        factor: '',
        factorName: '',
        indexType: '',
        measurement: '',
        decimal: '',
        sortNumber: '',
        note: ''
      },
      total: 0,
      page: 0,
      size: 5,
      addFlag: true,
      dialogVisible: false,
      multipleSelection: '',
      rules: {
        factor: [
          { required: true, message: '请输入因子编码', trigger: 'blur' },
          { max: 5, message: '长度需小于50个字符', trigger: 'blur' }
        ],
        factorName: [
          { required: true, message: '请输入因子名称', trigger: 'blur' },
          // { max: 50, message: '长度需小于50个字符', trigger: 'blur' }
        ],
      },
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
      // this.getTabList()
    },
    //关闭弹出框
    handleClose(done) {
      this.$refs["form"].resetFields();
      done();
    },
    handleCurrentChange(val) {
      this.page = val;
      // this.getTabList();
    },
    // 获取指标类型
    getIndexList(){
      this._publicFun('状态参数指标类别').then(res => {
        console.log(res)
        this.indexList = res;
      })
    },
    // 获取计量单位
    getMeasurementList(){
      this._publicFun('状态参数计量单位').then(res => {
        console.log(res)
        this.measurementList = res;
      })
    },
    // 获取表格数据
    getTableList(){
      let url = this.baseUrl + '/stateParam/page';
      let obj = {
        typeCode: '',
        keyword: '',
        pageNo: '',
        pageSize: ''
      }
      this.$axios.get(url,{
        params: obj
      }).then(res => {
        console.log(res)
      })
    },
    // 查询
    search(){},
    // 新增
    add(){
      this.dialogVisible = true;
      this.addFlag = true;
    },
    // 删除
    del(){},
    // 保存
    save(){},
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
.editForm{
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-dialog__header{
  background-color: #cecece;
}
</style>