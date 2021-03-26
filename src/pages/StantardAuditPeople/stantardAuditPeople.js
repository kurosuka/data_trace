/*
 * @Author: your name
 * @Date: 2021-03-24 17:10:51
 * @LastEditTime: 2021-03-24 17:15:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\StantardAuditPeople\stantardAuditPeople.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import StantardAuditPeople from '@views/StantardAuditPeople.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(StantardAuditPeople)
}).$mount('#app')
