<template>
  <div id="app">
    <div class="header">
      <div class="select">
        <span>站点：</span>
        <el-select v-model="pointValue" placeholder="请选择" multiple collapse-tags>
          <el-option-group
            v-for="(group,index) in pointList"
            :key="group.id"
            :label="group.title"
            style="width:600px;"
          >
            <el-option value :disabled="true">
              <el-radio-group v-model="areaPoint">
                <el-radio
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.id"
                  @change="handleCheckedChange(index)"
                >{{item.title}}</el-radio>
              </el-radio-group>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="select">
        <span>开始时间：</span>
        <el-date-picker
          v-model="strTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>状态：</span>
        <el-select
          v-model="factorValue"
          multiple
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in factorList"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button class="btn" type="primary" @click="search">查找</el-button>
      <el-button class="btn" type="primary" @click="add">新增</el-button>
      <el-button class="btn" type="primary" @click="search">提交</el-button>
      <el-button class="btn" type="primary" @click="del">删除</el-button>
    </div>
    <div class="body">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column fixed label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column 
          v-for="(item) in label" :key="item.title"
          :label="item.title"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          align="center"
          min-width="150px"
        ></el-table-column>
        <el-table-column prop="" label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增、编辑 -->
    <el-dialog
      title="新增"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="450px"
    >
      <el-form ref="form" label-width="80px" size="mini" :model="weekMsg" :rules="rules" class="editForm">
        <el-form-item label="点位" style="width:100%" prop="pointValue">
          <el-select v-model="weekMsg.pointValue" placeholder="请选择" filterable>
            <el-option
              v-for="item in pointList"
              :key="item.factorCode"
              :label="item.factorName"
              :value="item.factorCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺失开始时间" style="width:100%" prop="strTime">
          <el-date-picker
            v-model="weekMsg.strTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缺失结束时间" style="width:100%" prop="endTime">
          <el-date-picker
            v-model="weekMsg.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缺失原因" style="width:100%" prop="reason">
          <el-select v-model="weekMsg.reason" placeholder="请选择" multiple collapse-tags>
            <el-option
              v-for="item in reasonList"
              :key="item.paramCode"
              :label="item.paramName"
              :value="item.paramCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="save('form')">提交</el-button>
        <el-button type="primary" @click="reset('form')" >取消</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      pointList: [],
      pointValue: [],
      areaPoint: [],
      strTime: '',
      endTime: '',
      factorList: [
        {
          title: '已保存',
          value: '0'
        },
        {
          title: '已提交',
          value: '1'
        },
        {
          title: '已生效',
          value: '2'
        }
      ],
      factorValue: [],
      tableList: [],
      label: [
        {
          title: '时间'
        },
        {
          title: '站点名称'
        },
        {
          title: '运维商'
        },
        {
          title: '简要说明'
        },
        {
          title: '缺失原因'
        },
        {
          title: '状态'
        },
      ],
      loading: false,
      reasonList: [],
      dialogVisible: false,
      weekMsg: {
        pointValue: '',
        strTime: '',
        endTime: '',
        reason: ''
      },
      rules: {
        pointValue: [
          { required: true, message: '请选择点位', trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    indexMethod(index) {
      return index+1;
    },
    handleClose(done) {
      this.$refs["form"].resetFields();
      done();
    },
    // 获取点位信息
    getPointList(){
      
    },
    handleCheckedChange(){},
    // 获取表格数据
    getTableList(){
      
    },
    // 查询
    search(){
      
    },
    // 新增
    add(){
      this.dialogVisible = true;
    },
    // 保存
    save(){},
    // 取消
    reset(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 删除
    del(){},
    // 下载
    download(){}
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
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}
/* 头部查询 */
.header {
  display: flex;
  flex-wrap: wrap;
}
.select {
  display: flex;
  margin: 10px;
  width: 260px;
  font-size: 14px;
}
.select > span {
  display: inline-block;
  width: 90px;
  text-align: left;
  line-height: 30px;
}
.header > .el-button {
  height: 30px;
  margin: 10px;
  line-height: 0;
}
.el-select-dropdown__item {
  white-space: normal !important;
  height: auto !important;
  padding: 0 !important;
  padding-left: 30px !important;
}
.el-select-group > .el-checkbox {
  margin-left: 10px !important;
}
.el-select-group__title {
  font-size: 14px !important;
  font-weight: bold !important;
}
.el-select-group__wrap {
  padding-bottom: 16px !important;
}
.el-checkbox-group > .el-checkbox {
  margin-right: 12px !important;
}
/* 底部tabs */
.body {
  flex: 1;
  margin: 0 10px;
  /* width: 100%;
  height: 100%; */
}
/* 新增、编辑 */
.el-dialog__header {
  background-color: #cecece;
}
.el-form-item__label {
  width: 110px !important;
}
.el-form-item:nth-of-type(2) .el-input__inner,.el-form-item:nth-of-type(3) .el-input__inner {
  width: 89% !important;
}
</style>