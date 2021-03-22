/*
 * @Author: your name
 * @Date: 2021-03-22 09:35:30
 * @LastEditTime: 2021-03-22 10:11:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\zeroSkip\zeroSkip.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import ZeroSkip from '../../views/ZeroSkip.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(ZeroSkip)
}).$mount('#app')
