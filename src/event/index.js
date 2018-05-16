// 由于事件监听的特殊性，为了避免内存泄漏，我们在一个单例中枢进行跨语言的事件监听。
// 全局的监听有两种方案，一种是通过 vuex ，一种是自己控制.
// 我们暂时为自己编写的全局监听设计了两套方案 ， 如下：
// 第一套，参考 vuex ,做一个全局状态监听。 缺点是基于状态，难以应对无数据的通知。
// 第二套是 结合router 和 weaklymap,做基于路由的事件通知。 缺点是基于路由，只能在当前页面监听事件。
import status from './status'
import notice from './notice'

// let registeredEvents = []

// let originOn = bus.$on
// // event 是字符串。
// bus.$on = (event, callback) => {
//   originOn.call(bus, event, callback)
//   if (Object.prototype.toString.call(event) === '[object String]') {
//     if (!registeredEvents.includes(event)) {
//       // 不包含时，才进行注册。
//       axe.event.registerListener(event, (data) => {
//         bus.$emit(event, data)
//       })
//       registeredEvents.push(event)
//     }
//   }
// }

export default {
  status: status,
  notice: notice
}
