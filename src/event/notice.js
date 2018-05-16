// 第二套是 结合router 和 weaklymap,做基于路由的事件通知。 缺点是基于路由，只能在当前页面监听事件。
// 要求，在 router-view上 标记 ref="router" ,且注册的路由通知，只能作用在一级路由上，暂不支持嵌套路由。

import axe from 'axe4js'
import router from '../router'

class NotifyCenter {
  constructor () {
    // 使用weakmap来存储事件
    this.weakMap = new WeakMap()
    // 记录通知。
    this.registeredEvents = {}
  }
  //
  registerEvent (target, event, handler) {
    let registered = this.weakMap[target]
    if (!registered) {
      registered = {}
      this.weakMap[target] = registered
    }
    if (!registered[event]) {
      // 如果未注册，则计数加1.
      let count = this.registeredEvents[event]
      if (!count) {
        count = 0
        axe.event.registerListener(event, (payload) => {
          // 通过 router获取当前展示页面
          let currentVM = router.app.$children[0].$refs['router']
          // 根据页面获取监听。
          let registered = this.weakMap[currentVM]
          if (registered && registered[event]) {
            let handler = registered[event]
            handler.call(currentVM, payload)
          }
        })
      }
      count += 1
      this.registeredEvents[event] = count
    }
    // 即一个页面对于一个事件， 只能注册一次。
    registered[event] = handler
  }
  // 取消监听
  removeListener (target, event) {
    let registered = this.weakMap[target]
    if (registered && registered[event]) {
      registered[event] = undefined
      let count = this.registeredEvents[event] - 1
      this.registeredEvents[event] = count
      if (count < 1) {
        // 则取消监听
        axe.event.removeListener(event)
      }
    }
  }
}

export default new NotifyCenter()
