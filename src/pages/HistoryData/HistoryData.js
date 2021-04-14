/*
 * @Author: your name
 * @Date: 2021-04-08 09:37:05
 * @LastEditTime: 2021-04-08 10:19:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\HistoryData\HistoryData.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import HistoryData from '../../views/HistoryData.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
import echarts from 'echarts'
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(HistoryData)
}).$mount('#app')
