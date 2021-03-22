/*
 * @Author: your name
 * @Date: 2021-03-11 09:33:31
 * @LastEditTime: 2021-03-15 16:17:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auditlog from '../views/Auditlog.vue'
import Test from '../views/Test.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/factorlog',
    name: 'Auditlog',
    component: Auditlog
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    children: [
      {
        path: '/name',
        name: 'Name',
        component: 'Test'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
