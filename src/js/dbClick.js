/*
 * @Author: your name
 * @Date: 2021-04-06 09:59:51
 * @LastEditTime: 2021-04-06 10:11:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\js\dbClick.js
 */
export default {
  install (Vue) {
    // 防重复点击(指令实现)
    Vue.directive('preventReClick', {
      inserted (el, binding) {
        el.addEventListener('click', () => {
          console.log(123213);
          if (!el.disabled) {
            el.disabled = true
            el.classList.add("is-disabled")
            setTimeout(() => {
              el.disabled = false
              el.classList.remove("is-disabled")
            }, binding.value || 1000)
          }
        })
      }
    })
  }
}