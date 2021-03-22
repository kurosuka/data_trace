/*
 * @Author: your name
 * @Date: 2021-03-12 14:10:10
 * @LastEditTime: 2021-03-12 15:51:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\auditInex\auditIndex.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import DataAudit from '../../views/Auditlog.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(DataAudit)
}).$mount('#app')
