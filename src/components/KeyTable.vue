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
      <el-table-column label="参数值"></el-table-column>
      <el-table-column label="备案范围"></el-table-column>
      <el-table-column label="是否匹配"></el-table-column>
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
  }
}
</script>

<style>

</style>