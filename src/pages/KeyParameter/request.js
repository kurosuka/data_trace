/*
 * @Author: your name
 * @Date: 2021-05-06 13:42:21
 * @LastEditTime: 2021-05-07 08:39:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\KeyParameter\request.js
 */
import axios from 'axios'
const $axios = axios.create({
  baseURL: process.env.VUE_APP_URL
})
export function getKeyTable(params = {}) {
  console.log(process.env.VUE_APP_URL);
  return $axios({
    method: 'get',
    url: '/coverHour/getFactors',
    params
  })
}