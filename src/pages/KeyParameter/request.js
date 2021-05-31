/*
 * @Author: your name
 * @Date: 2021-05-06 13:42:21
 * @LastEditTime: 2021-05-07 08:39:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\KeyParameter\request.js
 */
import axios from 'axios'
import { getLocalstorage, getUrlParams } from '../../js/utils.js';
let userId = getLocalstorage('UserId') || getUrlParams(window.location.href).UserGuid
const $axios = axios.create({
  baseURL: 'http://192.168.90.55:9082/api'
})
export function getKeyTable(params = {}) {
  console.log(process.env.VUE_APP_URL);
  return $axios({
    method: 'get',
    url: '/coverHour/getFactors',
    params
  })
}
// 查询点位信息
export function getPoints(params = { userUid: userId }) {
  return $axios.request({
    method: 'get',
    params: params,
    url: '/paramRecord/getPointList'
  })
}
// 获取因子信息
export function getFactors(params = {}) {
  return $axios.request({
    method: 'get',
    params,
    url: '/paramRecord/queryFactorList'
  })
}
// 查询状态参数信息
export function queryParam(data = {}, params = {}) {
  return $axios.request({
    method: 'post',
    data: data,
    params: params,
    url: '/instrumentParamsData/queryParam',
    headers: {'Content-Type': 'application/json;charset=UTF-8'}
  })
}
// 获取单个点位因子的状态参数详情
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
    url: '/instrumentParamsData/queryParamMatch',
    data,
  })
}
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