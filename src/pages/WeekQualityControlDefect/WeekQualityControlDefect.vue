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
        <el-date-picker v-model="strTime" type="month" placeholder="选择日期" value-format="yyyy-MM"></el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker v-model="endTime" type="month" placeholder="选择日期" value-format="yyyy-MM"></el-date-picker>
      </div>
      <div class="select">
        <span>状态：</span>
        <el-select v-model="stateValue" multiple collapse-tags placeholder="请选择">
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
      <el-button v-if="false" class="btn" type="primary" @click="del">删除</el-button>
    </div>
    <div class="body">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column
          v-for="(item) in label"
          :key="item.title"
          :label="item.title"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          align="center"
          min-width="150px"
        ></el-table-column>
        <el-table-column prop label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button v-if="isEdit(scope.row)" type="text" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-popover
              placement="left"
              width="180"
              trigger="click"
              >
              <p>缺失文件下载项：</p>
              <a class="file" v-for="item in fileUrlList" :key="item.url" :href="item.url">{{item.name}}</a>
              <el-button slot="reference" type="text" size="mini" @click="download(scope.row)">下载</el-button> 
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增、编辑 -->
    <el-dialog
      v-if="dialogVisible"
      :title="addFlag?'新增':'修改'"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="450px"
    >
      <el-form
        ref="form"
        label-width="80px"
        size="mini"
        :model="weekMsg"
        :rules="rules"
        class="editForm"
      >
        <el-form-item label="点位" style="width:100%" prop="areaPoint">
          <el-select v-model="weekMsg.pointValue" placeholder="请选择" :disabled="!addFlag">
            <el-option-group
              v-for="(group) in pointList"
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
                    @change="handleCheckedChangeNew(item.pid)"
                  >{{item.title}}</el-radio>
                </el-radio-group>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="缺失年月" style="width:100%" prop="monthYear">
          <el-date-picker
            v-model="weekMsg.monthYear"
            type="month"
            placeholder="选择日期"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="changeTime"
            :picker-options="pickerOptions"
            :disabled="showTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缺失周" style="width:100%" prop="week">
          <el-select v-model="weekMsg.week" placeholder="请选择">
            <el-option
              v-for="item in weekList"
              :key="item.value"
              :label="item.title"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺失原因" style="width:100%" prop="reason">
          <el-select v-model="weekMsg.reason" placeholder="请选择">
            <el-option
              v-for="item in reasonList"
              :key="item.reasonUid"
              :label="item.reasonName"
              :value="item.reasonUid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺失说明" style="width:100%" prop="remark">
          <el-input v-model="weekMsg.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="缺失附件" style="width:100%" prop="fileList">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :file-list="weekMsg.fileList"
            accept=""
            :before-remove="beforeRemove"
            :auto-upload="false"
            :limit="5"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <span slot="tip" class="el-upload__tip">请选择缺失文件</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="save('form')">保存</el-button>
        <el-button type="success" @click="submit('form')">提交</el-button>
        <el-button type="primary" @click="reset('form')">取消</el-button>
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
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
export default {
  data: function() {
    const checkFile = (rule, value, callback) => {
      if(this.$refs.upload.uploadFiles.length === 0){
        return callback(new Error('请选择上传文件'));
      }else {
        callback();
      }
    };
    return {
      pointList: [],
      pointValue: "",
      areaPoint: "",
      strTime: "",
      endTime: "",
      stateList: [
        {
          title: "已保存",
          value: "1"
        },
        {
          title: "已提交",
          value: "2"
        },
        {
          title: "已生效",
          value: "3"
        },
        {
          title: "已拒绝",
          value: "4"
        }
      ],
      stateValue: ["1", "2", "3", "4"],
      tableList: [],
      label: [
        {
          title: "时间"
        },
        {
          title: "站点名称"
        },
        {
          title: "运维商"
        },
        {
          title: "简要说明"
        },
        {
          title: "缺失原因"
        },
        {
          title: "状态"
        }
      ],
      total: 0,
      page: 0,
      size: 15,
      multipleSelection: [],
      loading: false,
      reasonList: [
        {
          title: "停站",
          value: "1"
        },
        {
          title: "非人为因素",
          value: "1"
        },
        {
          title: "其他",
          value: "1"
        }
      ],
      weekList: [],
      dialogVisible: false,
      addFlag:true,
      weekMsg: {
        pointValue: "",
        areaPoint: "",
        monthYear: "",
        week: "",
        reason: "",
        remark: "",
        fileList: []
      },
      rules: {
        areaPoint: [
          { required: true, message: "请选择点位", trigger: "change" }
        ],
        monthYear: [
          { required: true, message: "请选择缺失年月", trigger: "change" }
        ],
        week: [
          { required: true, message: "请选择缺失周", trigger: "change" }
        ],
        reason: [
          { required: true, message: "请选择点位缺失原因", trigger: "change" }
        ],
        fileList: [
          { required: true, validator: checkFile},
        ],
      },
      subStatus: '',
      pid: '',
      baseUrl: window.configUrl,
      uploadUrl: "",
      showTime: true,
      pickerOptions: {},
      updateId: '',
      nowTime: '',
      fileUrlList: []
    };
  },
  mounted: function() {
    this.getTime();
    this.getPointList();
    this.getReasonList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    handleClose(done) {
      this.$refs["form"].resetFields();
      this.$refs.upload.clearFiles();
      done();
    },
    //分页条件
    handleSizeChange(val) {
      this.size = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableList();
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 获取点位信息
    getPointList() {
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
    handleCheckedChangeNew(val) {
      this.pid = val;
      this.weekMsg.pointValue = "";
      this.pointList.map(item => {
        item.children.map(list => {
          if (this.weekMsg.areaPoint == list.id) {
            this.weekMsg.pointValue = list.title;
          }
        });
      });
    },
    // 获取缺失原因
    getReasonList() {
      let url = this.baseUrl + "/weekQuality/queryMissingReasonList";
      this.$axios.get(url).then(res => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.code == 200) {
            let list = res.data.data;
            this.reasonList = list;
          }
        }
      });
    },
    // 获取表格数据
    getTableList() {
      let url = this.baseUrl + "/weekQuality/queryWeekMissingApplication";
      let obj = {
        pointId: this.areaPoint,
        // pointId: "322",
        statusList: this.stateValue,
        startTime: this.strTime,
        endTime: this.endTime,
        // startTime: "2021-01",
        // endTime: "2021-03",
        pageNo: this.page,
        pageSize: this.size
      };
      this.$axios.post(url, obj).then(res => {
        console.log(res);
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
          if (item.week == 1) {
            item['weekDay'] = '第一周(1-7日)';
          } else if (item.week == 2) {
            item['weekDay'] = '第二周(8-14日)';
          } else if (item.week == 3) {
            item['weekDay'] = '第三周(15-21日)';
          } else if (item.week == 4) {
            item['weekDay'] = '第四周(22-' + moment(item.month).daysInMonth() + '日)';
          }
          return item;
        });
        let _tableList = {
          month: "年月",
          weekDay: "周",
          pointName: "站点名称",
          operatorName: "运维商",
          remark: "简要说明",
          reasonName: "缺失原因",
          status: "状态"
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
    search() {
      this.page = 1;
      this.getTableList();
    },
    // 是否展示修改
    isEdit(val) {
      if(val.status == "已保存"){
        return true;
      }else {
        return false;
      }
    },
    // 新增
    add() {
      this.dialogVisible = true;
      this.addFlag = true;
      let obj = {
        pointValue: "",
        areaPoint: "",
        monthYear: this.nowTime,
        week: "",
        reason: "",
        remark: "",
        fileList: []
      };
      this.weekMsg = obj;
      this._getWeek(this.nowTime);
    },
    // 修改
    edit(val){
      this.dialogVisible = true;
      this.addFlag = false;
      this.updateId = val.id;
      console.log(val)
      this.weekMsg.pointValue = val.pointName;
      this.weekMsg.areaPoint = val.pointId;
      this.weekMsg.monthYear = val.month;
      this.weekMsg.week = val.week.toString();
      this.weekMsg.reason = val.reasonUid;
      this.weekMsg.remark = val.remark;
      this.weekMsg.fileList = this._fileArr(val);
      this.pid = val.operatorUid;
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认保存？").then(() => {
            this.subStatus = '1';
            this._save(formName);
          });
        }
      });
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认提交？").then(() => {
            this.subStatus = '2';
            this._save(formName);
          });
        }
      });
    },
    _save(formName) {
      let url = this.baseUrl + "/weekQuality/editWeekMissingApplicationSave";
      // let url = this.baseUrl + "";
      let file = this.$refs.upload.uploadFiles;
      let formData = new FormData();
      let lastFile = '';
      file.forEach(item => {
        if(item.raw){
          formData.append("file", item.raw);
        }else { 
          lastFile += item.url + ',';
        }
      });
      console.log(lastFile.replace(/,$/gi,''));
      formData.append("existFilePath", lastFile.replace(/,$/gi,''));
      formData.append("userUid", "39bd85ac-55e7-431e-9fa7-a217dcea23bf");
      formData.append("operatorUid", this.pid);
      formData.append("id", this.updateId);
      formData.append("status", this.subStatus);
      formData.append("pointId", this.weekMsg.areaPoint);
      formData.append("month", this.weekMsg.monthYear);
      formData.append("week", this.weekMsg.week);
      formData.append("reasonUid", this.weekMsg.reason);
      formData.append("remark", this.weekMsg.remark);
      this.$axios.post(url,formData).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.getTableList();
          this.dialogVisible = false;
          this.updateId = "";
          this.subStatus = "";
          this.pid = "";
          this.$refs[formName].resetFields();
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消
    reset(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 删除
    del() {},
    // 下载
    download(val) {
      if(val.filePath === '' ||  val.filePath === null){
        alert('暂无缺失文件！');
        return false;
      }
      console.log(this._fileArr(val));
      this.fileUrlList = this._fileArr(val);
    },
    // 构造下载文件数组
    _fileArr(val){
      let path = val.filePath.split(',');
      let arr = [];
      path.map(item => {
        let obj = {};
        let name = item.split('/');
        obj['name'] = name[name.length - 1];
        obj['url'] = item;
        arr.push(obj)
      });
      return arr;
    },
    // 根据选择月份变换周
    changeTime() {
      this.weekMsg.week = '';
      let date = new Date();
      let mounth = date.getMonth() + 1;
      this._getWeek(mounth);
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
        str = year - 1 + "-12";
      } else {
        str = year + "-" + time1;
      }
      let end = year + "-" + time2;
      this.strTime = str;
      this.endTime = end;
      this.nowTime = end;
      this.weekMsg.monthYear = end;
      this._getWeek(end);
    },
    // 生成周下拉内容
    _getWeek(val) {
      let lastDay = moment(val).daysInMonth();
      let day = moment().date();
      let newMonth = this.weekMsg.monthYear;
      let isSelect1 = true;
      let isSelect2 = true;
      let isSelect3 = true;
      let isSelect4 = true;
      if (day >= 1 && day <= 7) {
        isSelect1 = false;
        isSelect2 = false;
      } else if (day >= 8 && day <= 14) {
        isSelect2 = false;
        isSelect3 = false;
      } else if (day >= 15 && day <= 21) {
        isSelect3 = false;
        isSelect4 = false;
      } else if (day > 21) {
        this.showTime = false;
        let obj = {
          disabledDate: time => {
            return (
              time.getTime() < moment().valueOf() ||
              time.getTime() >
                moment()
                  .add(lastDay, "d")
                  .valueOf()
            );
          }
        };
        this.pickerOptions = obj;
        if (moment(newMonth).month() == moment().month()) {
          isSelect4 = false;
        } else if (moment(newMonth).valueOf() > moment().valueOf()) {
          isSelect1 = false;
        }
      }
      let arr = [
        {
          title: "第一周(1-7日)",
          value: "1",
          disabled: isSelect1
        },
        {
          title: "第二周(8-14日)",
          value: "2",
          disabled: isSelect2
        },
        {
          title: "第三周(15-21日)",
          value: "3",
          disabled: isSelect3
        },
        {
          title: "第四周(22-" + lastDay + "日)",
          value: "4",
          disabled: isSelect4
        }
      ];
      this.weekList = arr;
      console.log(arr);
    }
  }
};
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
/* 跳转 */
.file {
  display: inline-block;
  margin-top: 6px;
  text-decoration: none;
  color: #409EFF;
  font-size: 12px;
}
/* 新增、编辑 */
.el-dialog__header {
  background-color: #cecece;
}
.el-form-item:nth-of-type(2) .el-input__inner {
  width: 89% !important;
}
.page {
  padding-right: 5px;
  padding-bottom: 5px;
}
</style>