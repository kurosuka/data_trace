import Vue from 'vue'
import ElementUI from 'element-ui'
import ZeroPointData from './ZeroPointData.vue'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(ZeroPointData)
}).$mount('#zeroData')