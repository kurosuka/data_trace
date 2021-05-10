import Vue from 'vue'
import ElementUI from 'element-ui'
import weekStandardValueConfig from '../../views/weekStandardValueConfig.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
import DlgDraggable from "vue-element-dialog-draggable"
import preventReClick from '../../js/dbClick.js'
Vue.use(preventReClick)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(DlgDraggable, {
  containment: true //Constrains dragging to within the bounds of the window.  Default: false.
});
Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(weekStandardValueConfig)
}).$mount('#app')
