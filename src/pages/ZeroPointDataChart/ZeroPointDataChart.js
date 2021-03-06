import Vue from 'vue'
import ElementUI from 'element-ui'
import ZeroPointDataChart from './ZeroPointDataChart.vue'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.echarts=echarts;

Vue.use(ElementUI, {size: 'mini'});
new Vue({
  render: h => h(ZeroPointDataChart)
}).$mount('#app')