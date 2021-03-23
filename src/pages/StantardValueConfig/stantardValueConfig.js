/*
 * @Author: your name
 * @Date: 2021-03-22 17:28:15
 * @LastEditTime: 2021-03-23 08:49:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\DailyQuality\dailyQuality.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import StantardValueConfig from '../../views/StantardValueConfig.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(StantardValueConfig)
}).$mount('#app')
