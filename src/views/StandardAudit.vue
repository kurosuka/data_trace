
<template>
  <div class="daily-quality">
    <el-container>
      <el-main>
        <div class="nav">
          <el-form :model="form" :inline="true">
            <el-form-item label="点位"
              ><MultiSelect></MultiSelect
            ></el-form-item>
            <el-form-item label="监测项目">
              <el-tooltip :content="selectTooltip" placement="top">
                <el-select
                  v-model="form.selectValue"
                  placeholder="请选择"
                  :multiple="true"
                  :collapse-tags="true"
                >
                  <el-option
                    v-for="item in factorList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary">查询</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" @click="audit"
                >审核</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData" size="middle" @selection-change="handleSelectionChange">
              <el-table-column label="操作" type="selection"></el-table-column>
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column
                label="点位名称"
                prop="pointName"
              ></el-table-column>
              <el-table-column
                label="监测项目"
                prop="monitor"
              ></el-table-column>
              <el-table-column
                label="跨度值"
                prop="spanValue"
              ></el-table-column>
              <el-table-column
                label="零点标准浓液浓度"
                prop="zero"
              ></el-table-column>
              <el-table-column
                label="跨度标准浓液浓度"
                prop="spanStantard"
              ></el-table-column>
              <el-table-column label="提交人" prop="submiter"></el-table-column>
              <el-table-column label="提交时间" prop="time"></el-table-column>
            </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { MultiSelect } from "sinoyd-ui";
export default {
  name: "StandardAudit",
  data() {
    return {
      form: {
        selectValue: ['w', 'l', 'a', 'd'],
      },
      factorList: [
        {
          label: "高猛酸盐指数",
          value: "w",
        },
        {
          label: "氨氮",
          value: "a",
        },
        {
          label: "总磷",
          value: "l",
        },
        {
          label: "总氮",
          value: "d",
        },
      ],
      tableData: [
        {
          pointName: "通仙桥",
          monitor: "高锰酸盐指数",
          spanValue: "10",
          zero: "0",
          spanStantard: "7.941",
          time: "2020-11-25 09:20:11",
          submiter: "张三",
        },
        {
          pointName: "通仙桥",
          monitor: "氨氮",
          spanValue: "10",
          zero: "0",
          spanStantard: "7.941",
          time: "2020-11-25 09:20:11",
          submiter: "张三",
        },
        {
          pointName: "通仙桥",
          monitor: "总磷",
          spanValue: "10",
          zero: "0",
          spanStantard: "7.941",
          time: "2020-11-25 09:20:11",
          submiter: "张三",
        },
        {
          pointName: "通仙桥",
          monitor: "总氮",
          spanValue: "10",
          zero: "0",
          spanStantard: "7.941",
          time: "2020-11-25 09:20:11",
          submiter: "张三",
        },
      ],
      multiSelection: [], // 表格选中的行数据
    };
  },
  components: {
    MultiSelect,
  },
  computed: {
    selectTooltip() {
      return this.factorList
        .filter((item) => {
          return this.form.selectValue.includes(item.value);
        })
        .map((item) => {
          return item.label;
        })
        .join(",");
    },
  },
  mounted() {
    this.getOpints();
  },
  methods: {
    // 审核
    audit() {
      if(this.multiSelection.length === 0) {
        this.$notify({
          title: '提示',
          message: '请选择要审核的数据',
          type: 'warning'
        })
        return
      }
      // 审核接口调用
      this.$confirm('对勾选的数据进行审核，是否审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(()=> {

      }).catch(()=>{})
    },
    // 历史记录点击操作
    historyClick(scope) {
      console.log(scope);
      this.historyVisible = true;
    },
    // 获取 选择的值
    _selectData() {},
    // 获取点位数据
    getOpints() {
      this.$axios({
        method: "",
        url: "",
        data: "",
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          this.$notify({
            title: "提示",
            message: err,
            type: "warning",
          });
        });
    },
    // 获取因子下拉数据
    getFactors() {
      this.$axios({
        method: "",
        url: "",
        data: "",
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          this.$notify({
            title: "提示",
            message: err,
            type: "warning",
          });
        });
    },
    // 获取表格行数据
    handleSelectionChange(val) {
      console.log(val);
      this.multiSelection = val
    }
  },
};
</script>

<style lang="scss" scoped>
.nav .el-form-item {
  margin-right: 30px;
}
</style>