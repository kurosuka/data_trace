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
    <key-table :keyTable="keyData"></key-table>
  </div>
</template>

<script>
import KeyTable from '../../components/KeyTable.vue';
import { getUrlParams } from '../../js/utils.js'
import { queryParamByPointFactor, queryParamMatch } from './request.js'
export default {
  components: { KeyTable },
  data() {
    return {
      options: {}, // url上参数
      keyData: [],
    }
  },
  mounted() {
    this.options = getUrlParams(self.location.href);
    console.log(this.options);
    this.getQueryParamByPointFactor();
  },
  methods: {
    getQueryParamByPointFactor() {
      queryParamByPointFactor({
        pointId: this._decodeURIComponent(this.options.pointId),
        factorCode: this._decodeURIComponent(this.options.pollutantCode)
      }).then(res => {
        console.log(res);
        this.keyData = res.data.data;
        if(!this.keyData) {
          return 
        }
        const opt = {
          fromTime: `${this._decodeURIComponent(`${this.options.time}`).slice(0, 10)} 00:00:00`,
          toTime: this._decodeURIComponent(`${this.options.time}:00:00`),
          factorCode: this._decodeURIComponent(this.options.pollutantCode),
          fields: [...this.keyData.map((item)=> {
            return {
              field: item.paramCode
            }
          }),{field: 'status'}],
          snCriteria: 
            {
              sn:  this._decodeURIComponent(this.options.pointId),
              snName:  this._decodeURIComponent(this.options.pointName),
              orderNum: 1
            }
        }
        queryParamMatch(opt).then(res1 => {
          const MatchList = res1.data.data;
          this.keyData = this.keyData.map(item=> {
            item.v = MatchList[item.paramCode];
            item.status = MatchList[`${item.paramCode}_status`];
            return item;
          });
          console.log(this.keyData);
        })
      })
    },
    // 处理中文乱码问题
    _decodeURIComponent(str) {
      return decodeURIComponent(str)
    },
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