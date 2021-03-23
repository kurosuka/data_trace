<!--
 * @Author: your name
 * @Date: 2021-03-22 17:28:48
 * @LastEditTime: 2021-03-23 17:07:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\DailyQuality.vue
-->
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
                <el-select v-model="form.selectValue" placeholder="请选择" :multiple="true" :collapse-tags="true">
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
              <el-button type="warning" @click="dialogToggle">设置内容</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData" size="middle">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="点位名称" prop="pointName"></el-table-column>
          <el-table-column label="监测项目" prop="monitor"></el-table-column>
          <el-table-column label="跨度值" prop="spanValue"></el-table-column>
          <el-table-column label="零点标准浓液浓度" prop="zero"></el-table-column>
          <el-table-column label="跨度标准浓液浓度" prop="spanStantard"></el-table-column>
          <el-table-column label="提交人" prop="submiter"></el-table-column>
          <el-table-column label="提交时间" prop="time"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link @click="historyClick(scope)">历史记录</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog title="项目设置详情" :visible.sync="dialogVisble" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="dialogTableData" :border="true" size="small">
        <el-table-column label="监测项目" prop="title" align="center"></el-table-column>
        <el-table-column label="高猛酸盐指数" prop="cod" align="center">
          <template slot-scope="scope">
            <el-input v-model="dialogForm[scope.$index].cod" placeholder="" v-if="scope.row.cod == 'input'" type="number">
              <template slot="append">mg/L</template>
            </el-input>
            <el-button type="primary" v-if="scope.row.cod == 'btn'" @click="submitValue('cod')">提交</el-button>
            <span v-else-if="typeof scope.row.cod == 'number'">{{scope.row.cod}}mg/L</span>
          </template>
        </el-table-column>
        <el-table-column label="氨氮" align="center">
          <template slot-scope="scope">
            <el-input v-model="dialogForm[scope.$index].an" placeholder=""  v-if="scope.row.an == 'input'" type="number">
              <template slot="append">mg/L</template>
            </el-input>
            <el-button type="primary" v-if="scope.row.an == 'btn'" @click="submitValue('an')">提交</el-button>
            <span v-else-if="typeof scope.row.an == 'number'">{{scope.row.an}}mg/L</span>
          </template>
        </el-table-column>
        <el-table-column label="总磷" align="center">
          <template slot-scope="scope">
            <el-input v-model="dialogForm[scope.$index].ph" placeholder="" v-if="scope.row.ph =='input'" type="number">
              <template slot="append">mg/L</template>
            </el-input>
            <el-button type="primary" v-if="scope.row.ph == 'btn'" @click="submitValue('ph')">提交</el-button>
            <span v-else-if="typeof scope.row.ph == 'number'">{{scope.row.ph}}mg/L</span>
          </template>
        </el-table-column>
        <el-table-column label="总氮" align="center">
          <template slot-scope="scope">
            <el-input v-model="dialogForm[scope.$index].nt" placeholder="" v-if="scope.row.nt =='input'" type="number">
              <template slot="append">mg/L</template>
            </el-input>
            <el-button type="primary" v-if="scope.row.nt == 'btn'" @click="submitValue('nt')">提交</el-button>
            <span v-else-if="typeof scope.row.nt == 'number'">{{scope.row.nt}}mg/L</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--历史记录-->
    <el-dialog title="操作记录" :visible.sync="historyVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="historyData">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="点位名称"></el-table-column>
        <el-table-column label="点位名称" prop="pointName"></el-table-column>
        <el-table-column label="监测项目" prop="monitor"></el-table-column>
        <el-table-column label="跨度值" prop="spanValue"></el-table-column>
        <el-table-column label="零点标准浓液浓度" prop="zero"></el-table-column>
        <el-table-column label="跨度标准浓液浓度" prop="spanStantard"></el-table-column>
        <el-table-column label="提交人" prop="submiter"></el-table-column>
        <el-table-column label="提交时间" prop="time"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { MultiSelect } from "sinoyd-ui";
export default {
  name: "DailyQuality",
  data() {
    return {
      form: {
        selectValue: [],
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
          pointName: '通仙桥',
          monitor: '高锰酸盐指数',
          spanValue: '10',
          zero: '0',
          spanStantard: '7.941',
          time: '2020-11-25 09:20:11',
          submiter: '张三',
        },
        {
          pointName: '通仙桥',
          monitor: '氨氮',
          spanValue: '10',
          zero: '0',
          spanStantard: '7.941',
          time: '2020-11-25 09:20:11',
          submiter: '张三',
        },
        {
          pointName: '通仙桥',
          monitor: '总磷',
          spanValue: '10',
          zero: '0',
          spanStantard: '7.941',
          time: '2020-11-25 09:20:11',
          submiter: '张三',
        },
        {
          pointName: '通仙桥',
          monitor: '总氮',
          spanValue: '10',
          zero: '0',
          spanStantard: '7.941',
          time: '2020-11-25 09:20:11',
          submiter: '张三',
        }
      ],
      dialogTableData: [
        {
          title: '上一周水质平均值',
          cod: 2.85, // 高锰酸盐指数
          an: 2.85,  // 氨氮
          ph: 2.85,  // 总磷
          nt: 2.85, // 总氮
        },
        {
          title: '跨度值',
          cod: 'input', // 高锰酸盐指数
          an: 'input',  // 氨氮
          ph: 'input',  // 总磷
          nt: 'input', // 总氮
        },
        {
          title: '零点标准浓液浓度',
          cod: 'input', // 高锰酸盐指数
          an: 'input',  // 氨氮
          ph: 'input',  // 总磷
          nt: 'input', // 总氮
        },
        {
          title: '跨度标准浓液浓度',
          cod: 'input', // 高锰酸盐指数
          an: 'input',  // 氨氮
          ph: 'input',  // 总磷
          nt: 'input', // 总氮
        },
        {
          title: '',
          cod: 'btn', // 高锰酸盐指数
          an: 'btn',  // 氨氮
          ph: 'btn',  // 总磷
          nt: 'btn', // 总氮
        }
      ],
      dialogVisble: false,
      dialogForm: [],
      historyData: [],
      historyVisible: true,
      /* {
        cod: '',
        an: '',
        ph: '',
        nt: ''
      } */
    };
  },
  components: {
    MultiSelect,
  },
  computed: {
    selectTooltip() {
      return this.factorList.filter(item=> {
        return this.form.selectValue.includes(item.value)
      }).map(item=> {
        return item.label
      }).join(',')
    }
  },
  mounted() {
    this.getOpints();
    this.tableData.forEach((item, index)=> {
      console.log(item);
      this.$set(this.dialogForm,index, {
        cod: '',
        an: '',
        ph: '',
        nt: ''
      });
    });
    this.dialogForm.map((item,index)=> {
      if(index == 1) {
        this.dialogForm[index].cod = this.tableData.filter(item=> item.monitor == '高锰酸盐指数')[0].spanValue;
        this.dialogForm[index].an = this.tableData.filter(item=> item.monitor == '氨氮')[0].spanValue;
        this.dialogForm[index].ph = this.tableData.filter(item=> item.monitor == '总磷')[0].spanValue;
        this.dialogForm[index].nt = this.tableData.filter(item=> item.monitor == '总氮')[0].spanValue;
      } else if(index == 2) {
        this.dialogForm[index].cod = this.tableData.filter(item=> item.monitor == '高锰酸盐指数')[0].zero;
        this.dialogForm[index].an = this.tableData.filter(item=> item.monitor == '氨氮')[0].zero;
        this.dialogForm[index].ph = this.tableData.filter(item=> item.monitor == '总磷')[0].zero;
        this.dialogForm[index].nt = this.tableData.filter(item=> item.monitor == '总氮')[0].zero;
      } else if(index == 3) {
        this.dialogForm[index].cod = this.tableData.filter(item=> item.monitor == '高锰酸盐指数')[0].spanStantard;
        this.dialogForm[index].an = this.tableData.filter(item=> item.monitor == '氨氮')[0].spanStantard;
        this.dialogForm[index].ph = this.tableData.filter(item=> item.monitor == '总磷')[0].spanStantard;
        this.dialogForm[index].nt = this.tableData.filter(item=> item.monitor == '总氮')[0].spanStantard;
      }
    })
  },
  methods: {
    // 提交信息
    submitValue(index) {
      var options = this.dialogForm.map(item=>item[index]);
      console.log(options);
    },
    // 显示设置内容弹窗
    dialogToggle() {
      this.dialogVisble = true;
    },
    // 历史记录
    historyClick(scope) {
      console.log(scope);
      this.historyVisible = true;
    },
    // 获取 选择的值
    _selectData() {
      
    },
    // 获取点位
    getOpints() {
      this.$axios({
        method: '',
        url: '',
        data: ''
      }).then(res=> {
        console.log(res);
      }).catch(err=>{
        this.$notify({
          title: '提示',
          message: err,
          type: 'warning'
        })
      })
    },
    // 获取因子数据
    getFactors() {
      this.$axios({
        method: '',
        url: '',
        data: ''
      }).then(res=> {
        console.log(res);
      }).catch(err=>{
        this.$notify({
          title: '提示',
          message: err,
          type: 'warning'
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.nav .el-form-item {
  margin-right: 30px;
}
</style>