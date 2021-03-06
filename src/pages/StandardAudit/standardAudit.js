/*
 * @Author: your name
 * @Date: 2021-03-24 09:52:18
 * @LastEditTime: 2021-04-06 10:27:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\StantardAuditConfig\stantardAuditConfig.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import StandardAudit from '@/views/StandardAudit.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
import preventReClick from '../../js/dbClick.js'
Vue.use(preventReClick)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(StandardAudit)
}).$mount('#app')
