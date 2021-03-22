
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
