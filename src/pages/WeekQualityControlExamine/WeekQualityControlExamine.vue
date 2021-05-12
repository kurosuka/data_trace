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
    </div>
    <div class="body">
      <el-table :data="tableList" stripe v-loading="loading" size="mini" height="calc(100% - 10px)">
        <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button v-if="isShow(scope.row)" type="text" size="mini" @click="examine(scope.row)">通过</el-button>
            <el-button v-if="isShow(scope.row)" type="text" size="mini" @click="refuse(scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
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
    return {
      pointList: [],
      pointValue: "",
      areaPoint: "",
      strTime: "",
      endTime: "",
      stateList: [
        {
          title: "待审核",
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
      stateValue: ["2", "3", "4"],
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
      loading: false,
      baseUrl: window.API,
      subStatus: '',
      fileUrlList: [],
    };
  },
  mounted: function() {
    this.getTime();
    this.getPointList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
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
            item.status = "待审核";
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
    // 审核权限
    isShow(val){
      if(val.status == "待审核"){
        return true;
      }else {
        return false;
      }
    },
    // 审核
    examine(val){
      console.log(val)
      this.$confirm("是否通过申请？").then(() => {
        this.subStatus = '3';
        let id = val.id;
        this.handleDel(id);
      });
    },
    refuse(val){
      console.log(val)
      this.$confirm("是否拒绝申请？").then(() => {
        this.subStatus = '4';
        let id = val.id;
        this.handleDel(id);
      });
    },
    async handleDel(id){
      let url = this.baseUrl + '/weekQuality/batchAuditWeekMissingApplication';
      try{
        let res=await this.$axios.delete(url,{
          params:{
            ids: id,
            status: this.subStatus
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
        this.subStatus = "";
        this.getTableList();
      }catch(e){
        console.log(e)
      }
    },
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