/*
 * @Author: your name
 * @Date: 2021-05-07 09:35:47
 * @LastEditTime: 2021-05-07 13:06:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\RightProcessLog\request.js
 */
import axios from 'axios'
const $axios = axios.create({
  baseURL: window.API
})
/**
 * 
 * @param {*} params 
 * @returns 
 * @description 获取流程日志
 */
export function queryParamProcessLog(data = {}, params = {}) {
  return $axios.request({
    method: 'post',
    data,
    params,
    url: '/instrumentParamsData/queryParamProcessLog',
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
  })
}
/**
 * 
 * @param {*} params 
 * @returns 
 * @description 获取关键参数
 */
export function queryParamByPointFactor(params = {}) {
  return $axios.request({
    method: 'get',
    params,
    url: '/paramRecord/queryParamByPointFactor'
  })
}