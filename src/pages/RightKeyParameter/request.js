/*
 * @Author: your name
 * @Date: 2021-05-07 08:44:05
 * @LastEditTime: 2021-05-07 08:44:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\RightKeyParameter\request.js
 */
// 获取单个点位因子的状态参数详情
import axios from 'axios'
const $axios = axios.create({
  baseURL: window.API
})
export function queryParamByPointFactor(params = {}) {
  return $axios.request({
    method: 'get',
    params,
    url: '/paramRecord/queryParamByPointFactor'
  })
}
// 关键参数匹配情况
export function queryParamMatch(data = {}) {
  return $axios.request({
    method: 'post',
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    url: '/instrumentParamsData/queryCheckParamMatch',
    data,
  })
}