<!--
 * @Author: your name
 * @Date: 2021-04-01 11:14:31
 * @LastEditTime: 2021-04-01 13:45:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\components\NoData.vue
-->
<template>
  <div class="no-data">
    <div>
      <img src="../assets/empty.svg" alt="暂无数据" :width="width" :height="height">
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: ['size'],
  data() {
    return {
      width: '100%',
      height: '100%'
    }
  },
  mounted() {
    console.log(this.size);
    switch (this.size) {
        case 'large': 
        this.width = this.height = "150%";
        break;
        case 'medium':
          this.width = this.height = '100%';
          break;
        case 'small':
          this.width = this.height = '70%';
          break;
        case 'mini':
          this.width = this.height = '50%'
        break;
        default:
        break
      }
  }
}
</script>

<style lang="scss" scoped>
  .no-data {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      display: block;
    };
    text-align: center;
  }
</style>