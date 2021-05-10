<!--
 * @Author: your name
 * @Date: 2021-05-07 08:43:59
 * @LastEditTime: 2021-05-07 08:58:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\RightKeyParameter\index.vue
-->
<template>
  <div class="main">
    <key-table></key-table>
  </div>
</template>

<script>
import KeyTable from '../../components/KeyTable.vue';
import { getUrlParams } from '../../js/utils.js'
export default {
  components: { KeyTable },
  data() {
    return {
      options: {}, // url上参数
    }
  },
  mounted() {
    this.options = getUrlParams(self.location.href);
    console.log(this.options);
  }
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
.main {
  padding: 0;
  margin: 0;
}
</style>