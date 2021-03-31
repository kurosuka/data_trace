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
          <span>监测污染物：</span>
          <el-select v-model="contaminantsValue" placeholder="请选择" filterable clearable>
            <!-- <el-option label="所有选项" value=""></el-option> -->
            <el-option
              v-for="item in contaminantsList"
              :key="item.indexId"
              :label="item.indexName"
              :value="item.indexId">
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
      width="800px"
    >
      <el-form ref="form" label-width="80px" size="mini" :model="indexMsg" :rules="rules" class="editForm">
        <el-form-item label="监测污染物" style="width:49%" prop="pointId">
          <el-select v-model="indexMsg.contaminants" placeholder="请选择" filterable>
            <el-option
              v-for="item in contaminantsList"
              :key="item.pointId"
              :label="item.pointName"
              :value="item.pointId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态参数" style="width:49%" prop="type">
          <el-select v-model="indexMsg.state" placeholder="请选择">
            <el-option
              v-for="item in stateList"
              :key="item.typeCode"
              :label="item.typeName"
              :value="item.typeCode">
            </el-option>
          </el-select>
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
      contaminantsList: [],
      contaminantsValue: [],
      factorValue: '',
      stateList: [],
      label: [],
      tableList: [],
      indexMsg: {
        contaminants: '',
        state: '',
      },
      total: 0,
      page: 0,
      size: 5,
      addFlag: true,
      dialogVisible: false,
      multipleSelection: '',
      rules: [
        {}
      ],
      baseUrl: ''
    }
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
    // 查询
    search(){
      this.page = 1;
    },
    // 新增
    add(){},
    // 删除
    del(){},
    // 保存
    save(){},
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
</style>