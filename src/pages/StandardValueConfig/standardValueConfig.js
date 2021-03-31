/*
 * @Author: your name
 * @Date: 2021-03-22 17:28:15
 * @LastEditTime: 2021-03-30 10:34:37
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
import DlgDraggable from "vue-element-dialog-draggable"
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(DlgDraggable, {
  containment: true //Constrains dragging to within the bounds of the window.  Default: false.
});
Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(StandardValueConfig)
}).$mount('#app')
