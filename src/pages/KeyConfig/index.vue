<!--
 * @Author: your name
 * @Date: 2021-05-08 09:45:52
 * @LastEditTime: 2021-05-08 10:15:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\KeyConfig\index.vue
-->
<template>
  <div class="key-config">
    <el-main>
      <el-row type="flex" justify="right">
        <el-col :span="6">
          <el-button type="primary">新增</el-button>
          <el-button type="danger">删除</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :model="headerForm" inline class="header-form">
            <el-form-item label="指标类别">
              <el-select v-model="headerForm.targetType" placeholder="指标类别">
                <el-option v-for="item in targetList" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=""><el-input style="width: 220px" v-model="headerForm.keyName" placeholder="关键字（因子编码，因子名称）"></el-input></el-form-item>
            <el-form-item label=""><el-button type="primary">查询</el-button></el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'KeyConfig',
  data() {
    return {
      headerForm: {
        keyName: '',
        targetType: ''
      }
    };
  },
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
.header-form {
  display: flex;
  justify-content: flex-end;
}
</style>
