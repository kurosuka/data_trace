<template>
  <div id="app">
    <div class="header">
      <div class="select">
        <span>站点：</span>
        <el-select v-model="pointValue" placeholder="请选择">
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
          type="month"
          placeholder="选择日期"
          value-format="yyyy-MM"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker
          v-model="endTime"
          type="month"
          placeholder="选择日期"
          value-format="yyyy-MM"
        ></el-date-picker>
      </div>
      <div class="select">
        <span>状态：</span>
        <el-select
          v-model="stateValue"
          multiple
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button class="btn" type="primary" @click="search">查找</el-button>
      <el-button class="btn" type="primary" @click="add">新增</el-button>
      <el-button class="btn" type="primary" @click="del">删除</el-button>
    </div>
    <div class="body">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
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
            <el-button type="text" size="mini" @click="download(scope.row)">下载</el-button>
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
          <el-select v-model="weekMsg.pointValue" placeholder="请选择">
          <el-option-group
            v-for="(group,index) in pointList"
            :key="group.id"
            :label="group.title"
            style="width:600px;"
          >
            <el-option value :disabled="true">
              <el-radio-group v-model="weekMsg.areaPoint">
                <el-radio
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.id"
                  @change="handleCheckedChangeNew(index)"
                >{{item.title}}</el-radio>
              </el-radio-group>
            </el-option>
          </el-option-group>
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
        <el-form-item label="缺失附件" style="width:100%" prop="reason">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :file-list="fileList"
            accept=".xlsx,.xls"
            :auto-upload="false"
            :limit="1">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <span slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</span>
          </el-upload>
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
      pointValue: '',
      areaPoint: '',
      strTime: '',
      endTime: '',
      stateList: [
        {
          title: '已保存',
          value: '1'
        },
        {
          title: '已提交',
          value: '2'
        },
        {
          title: '已生效',
          value: '3'
        },
        {
          title: '已拒绝',
          value: '4'
        }
      ],
      stateValue: ['1','2','3','4'],
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
        areaPoint: '',
        strTime: '',
        endTime: '',
        reason: '',
        fileList: []
      },
      rules: {
        pointValue: [
          { required: true, message: '请选择点位', trigger: 'change' }
        ],
      },
      baseUrl: window.configUrl,
      uploadUrl: '',
    }
  },
  mounted: function(){
    this.getTime();
    this.getPointList();
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
      let url = this.baseUrl + "/weekQuality/getPointList";
      this.$axios.get(url).then(res => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.code == 200) {
            let list = res.data.data;
            this.pointList = list;
            this.pointValue = list[0].children[0].title;
            this.areaPoint = list[0].children[0].id;
            this.getTableList();
          }
        }
      });
    },
    handleCheckedChange() {
      this.pointValue = "";
      this.pointList.map(item => {
        item.children.map(list => {
          if (this.areaPoint == list.id) {
            this.pointValue = list.title;
          }
        });
      });
    },
    handleCheckedChangeNew() {
      this.weekMsg.pointValue = "";
      this.pointList.map(item => {
        item.children.map(list => {
          if (this.weekMsg.areaPoint == list.id) {
            this.weekMsg.pointValue = list.title;
          }
        });
      });
    },
    // 获取表格数据
    getTableList(){
      let url = this.baseUrl + "/weekQuality/queryWeekMissingApplication";
      let obj = {
        // pointId: this.areaPoint,
        pointId: '322',
        statusList: this.stateValue,
        // startTime: this.strTime,
        // endTime: this.endTime,
        startTime: '2021-01',
        endTime: '2021-03',
        pageNo: this.page,
        pageSize: this.size
      };
      this.$axios.post(url, obj).then(res => {
        console.log(res)
        let val = res.data.data;
        this.total = val.total;
        this.size = val.size;
        this.page = val.current;
        let list = val.records;
        let cloneList = JSON.parse(JSON.stringify(list));
        this.tableList = cloneList.map(item => {
          if (item.status == 1) {
            item.status = "已保存";
          } else if (item.status == 2) {
            item.status = "已提交";
          } else if (item.status == 3) {
            item.status = "已生效";
          } else if (item.status == 4) {
            item.status = "已拒绝";
          }
          return item;
        });
        let _tableList = {
          month: "年月",
          week: "周",
          pointName: "站点名称",
          operatorName: "运维商",
          remark: "简要说明",
          reasonName: "缺失原因",
          status: "状态",
        };
        let labelList = Object.entries(_tableList);
        this.label = labelList.map(function(item) {
          return {
            title: item[1],
            prop: item[0]
          };
        });
      });
    },
    // 查询
    search(){
      
    },
    // 新增
    add(){
      this.dialogVisible = true;
      let obj = {
        pointValue: '',
        areaPoint: '',
        strTime: '',
        endTime: '',
        reason: '',
        fileList: []
      };
      this.weekMsg = obj;
    },
    // 保存
    save(formName){
      let url = this.baseUrl + '';
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
    // 删除
    del(){},
    // 下载
    download(val){
      console.log(val)
      // window.open(val.filePath);
      window.location.href = val.filePath;
    },
    // 获取当前时间
    getTime() {
      let date = new Date();
      let year = date.getFullYear();
      let mounth = date.getMonth() + 1;
      let str;
      let time1, time2;
      mounth < 10 ? (time1 = "0" + (mounth - 1)) : (time1 = mounth);
      mounth < 10 ? (time2 = "0" + mounth) : (time2 = mounth);
      if (mounth == "1") {
        str = (year - 1) + "-12";
      }  else {
        str = year + "-" + time1;
      }
      let end = year + "-" + time2;
      this.strTime = str;
      this.endTime = end;
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
.el-radio {
  margin-bottom: 12px !important;
}
.el-radio__inner {
  border-radius: 0 !important;
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
.el-tag__close {
  display: none !important;
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
.page {
  padding-right: 5px;
  padding-bottom: 5px;
}
</style>