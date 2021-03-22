import Vue from 'vue'
import DailyQualityControl from './DailyQualityControl.vue'
import axios from 'axios'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.prototype.$axios=axios;

Vue.use(elementui, {size: 'mini'})

new Vue({
  el:'#dayAuto',
  render: h => h(DailyQualityControl),
}).$mount('#dayAuto')