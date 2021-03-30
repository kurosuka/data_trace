/*
 * @Author: your name
 * @Date: 2021-03-22 17:28:15
 * @LastEditTime: 2021-03-29 17:33:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\DailyQuality\dailyQuality.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import StandardValueConfig from '../../views/StandardValueConfig.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(StandardValueConfig)
}).$mount('#app')
