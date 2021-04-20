/*
 * @Author: your name
 * @Date: 2021-03-22 15:57:56
 * @LastEditTime: 2021-04-20 10:35:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\js\utils.js
 */

/**
 * 
 * @param {String} url url地址
 * @returns {Object} params 所有参数
 */
 export function getUrlParams (url) {
  let arrObj = url.split('?')
  const params = {}
  if (arrObj.length > 1) {
    arrObj = arrObj[1].split('#')[0].split('&')
    arrObj.forEach(item => {
      item = item.split('=')
      params[item[0]] = item[1]
    })
  }
  return params
}
export function getLocalstorage(key) {
  if(window.localStorage) {
    return window.sessionStorage.getItem(key)
  }
}