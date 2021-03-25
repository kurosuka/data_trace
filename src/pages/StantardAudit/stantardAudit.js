/*
 * @Author: your name
 * @Date: 2021-03-24 09:52:18
 * @LastEditTime: 2021-03-24 15:38:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\StantardAuditConfig\stantardAuditConfig.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import StantardAudit from '@/views/StantardAudit.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(StantardAudit)
}).$mount('#app')
