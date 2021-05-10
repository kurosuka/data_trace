/*
 * @Author: your name
 * @Date: 2021-05-07 09:35:33
 * @LastEditTime: 2021-05-07 09:41:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\RightProcessLog\index.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import KeyTable from './index.vue'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import DlgDraggable from "vue-element-dialog-draggable"
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(DlgDraggable, {
  containment: true //Constrains dragging to within the bounds of the window.  Default: false.
});
Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(KeyTable)
}).$mount('#app')