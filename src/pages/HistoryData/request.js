/*
 * @Author: your name
 * @Date: 2021-04-08 14:46:53
 * @LastEditTime: 2021-04-08 15:01:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\pages\HistoryData\request.js
 */
import axios from 'axios' 
import qs from 'qs'
export function getHistoryData(data = {}) {
  return  axios(
    {
      method: 'post',
      url: 'http://183.166.140.243:8088/api/auditMark/allEnabledByEnv',
      data: qs.stringify(data)
    }
  )
}