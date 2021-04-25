import Vue from 'vue'
import ElementUI from 'element-ui'
import weekStandardAudit from '@/views/weekStandardAudit.vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'reset.css'
import axios from 'axios'
import preventReClick from '../../js/dbClick.js'
Vue.use(preventReClick)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(ElementUI, {size: 'mini'})
new Vue({
  render: h => h(weekStandardAudit)
}).$mount('#app')
