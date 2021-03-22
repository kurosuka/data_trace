<template>
  <div id="dayAuto">
    <div class="header">
      <div class="select">
        <span>站点：</span>
        <el-select v-model="pointValue" placeholder="请选择" multiple collapse-tags>
          <el-option-group v-for="(group,index) in pointList" :key="group.RowGuid" style="width:600px;">
            <el-checkbox :indeterminate="isIndeterminate[index]" v-model="checkAll[index]"
              @change="handleCheckAllChange(index)">{{group.Name}}</el-checkbox>
            <el-option value="" :disabled="true">
              <el-checkbox-group v-model="areaPoint[index]">
                <el-checkbox v-for="item in group.PointApis" :key="item.Id" :label="item.Id"
                  @change="handleCheckedChange(index)">{{item.Name}}</el-checkbox>
              </el-checkbox-group>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="select">
        <span>开始时间：</span>
        <el-date-picker v-model="strTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="select">
        <span>结束时间：</span>
        <el-date-picker v-model="endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="select">
        <span>监测项目：</span>
        <el-select v-model="factorValue" placeholder="请选择">
          <el-option v-for="item in factorList" :key="item.value" :label="item.title" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div>
      
    </div>
  </div>
</template>
<script>
export default {
  name:'dayAuto',
  data: function(){
    return {
      pointList: [],
      pointValue: [],
      strTime: '',
      endTime: '',
      factorList: [],
      factorValue: []
    }
  },
  mounteds: {
    handleCheckAllChange(index){
      console.log(index)
    },
    handleCheckedChange(index){
      console.log(index)
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}
body {
  height: 100%;
}

</style>