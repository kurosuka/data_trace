<!--
 * @Author: your name
 * @Date: 2021-03-24 17:06:43
 * @LastEditTime: 2021-03-24 17:46:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\StantardAuditPeople.vue
-->
<template>
  <div class="stantard-people">
    <el-container>
      <el-aside width="200px">
        <el-tree ref="tree" :data="treeData" node-key="label" :default-expand-all="true" highlight-current></el-tree>
      </el-aside>
      <el-main>
        <el-button type="warning" @click="save">保存</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'StantardAuditPeople',
  data() {
    return {
      treeData: [
        {
          label: '全部',
          children: [{
            label: '部门',
            children: [{
              label: '张三'
            }]
          }]
        }
      ],
    }
  },
  methods: {
    save() {
      console.log(this.$refs.tree.getCurrentKey());
    }
  }
}
</script>

<style lang="scss" scoped>
.stantard-people {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      border-right: 1px solid #eee;
    }
  }
}
</style>