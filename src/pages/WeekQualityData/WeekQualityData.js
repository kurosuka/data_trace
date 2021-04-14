/*
 * @Author: your name
 * @Date: 2021-03-29 15:49:59
 * @LastEditTime: 2021-04-07 11:35:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\SupportDocument\SupportDocument.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import WeekQualityData from '../../views/WeekQualityData.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(WeekQualityData)
}).$mount('#app')
