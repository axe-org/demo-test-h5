import axe from 'axe4js'
import Vue from 'vue'

// 参考 vuex 编写的基于状态的事件通知。
class Store {
  constructor (initialState = {}) {
    this._vm = new Vue({
      data: {
        $$state: initialState
      }
    })
  }
  // 如果确保已经注册，则可以使用 store.state.event 这种形式。
  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    // 不能设置
  }
  // 监听事件，监听那些没有数据、或者不需要数据的事件。
  listenEvent (event) {
    if (!this._vm._data.$$state[event]) {
      this._vm._data.$$state[event] = 1
      axe.event.registerListener(event, () => {
        // 记录事件加一，以传递通知。
        let state = {...this._vm.$data.$$state}
        state[event] += 1
        this._vm._data.$$state = state
      })
    }
    return this._vm._data.$$state[event]
  }
  // 监听事件，传递数据的事件。返回值为 Payload类型 （我们要求，通过该函数监听的事件，必须带有数据。）
  // 可以用这方法来监听，也可以直接放在computed方法中。
  listenState (event, defaultValue) {
    if (!this._vm._data.$$state[event]) {
      // 我们约束必须传参数！！！
      if (defaultValue) {
        this._vm._data.$$state[event] = defaultValue
      } else {
        // 如果没有设置默认值，则放一个空的 Payload。
        this._vm._data.$$state[event] = axe.data.create()
      }
      // 所以，只要没有值，就表示事件没有注册。
      axe.event.registerListener(event, (payload) => {
        // 记录事件加一，以传递通知。
        let state = {...this._vm.$data.$$state}
        state[event] = payload
        this._vm._data.$$state = state
      })
    }
    return this._vm._data.$$state[event]
  }
}

export default new Store()
