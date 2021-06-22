<!--
 * @Author: your name
 * @Date: 2021-05-06 15:19:22
 * @LastEditTime: 2021-05-06 15:38:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\components\KeyTable.vue
-->
<template>
  <div class="key-table">
    <el-table :data="keyTable">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="名称" prop="paramName"></el-table-column>
      <el-table-column label="参数值">
        <template slot-scope="scope">
          {{ !_isEmpty(scope.row.v) ? scope.row.v : '--'}}
        </template>
      </el-table-column>
      <el-table-column label="备案范围">
        <template slot-scope="scope">
          {{_txt(scope.row.paramLowerLimit, scope.row.paramUpperLimit)}}
        </template>
      </el-table-column>
      <el-table-column label="是否匹配">
        <template slot-scope="scope">
           <span :style="{'color': scope.row.status === '0' ? '#ff0000' : ''}">{{_matchTxt(scope.row.status)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "KeyTable",
  data() {
    return {

    }
  },
  props: {
    keyTable: {
      type: Array,
      default: ()=> {
        return []
      },
      required: false
    }
  },
  methods: {
    _txt(lower, upper){
      if(lower!=null && upper != null) {
        return `${lower}~${upper}`
      } else {
        return '--'
      }
    },
    _matchTxt(val) {
      console.log(typeof val);
      if(val === '1') {
        return '匹配'
      }
      if(val === '0') {
        return '不匹配'
      }
      if(val === '') {
        return '--'
      }
      return val;
    },
    _isEmpty(input) {
      return input === null || input === undefined || input === '' ? true : false;
    }
  },
}
</script>

<style>

</style>