<template>
  <div class="hello">
    <!-- 路由测试 -->
    <mt-button class="button" @click.native="register" size="large">error register example : eventA</mt-button>
    <mt-button class="button" @click.native="postEventA" size="large">postEventA</mt-button>
    <mt-button class="button" size="large" disabled>status : login  : {{ login }}</mt-button>
    <mt-button class="button" size="large" disabled>status : account : {{ account }}</mt-button>

    <mt-popup v-model="popupVisible2" position="top" class="mint-popup-2" :modal="false">
      <p style="line-height: 50px;color: #fff;">notice : {{ msg }}</p>
    </mt-popup>
    <mt-button class="button" @click.native="registerEventA" size="large">registerEventA by notice</mt-button>

    <mt-button class="button" style="margin-top: 30px;" @click.native="goback" size="large">goback</mt-button>
  </div>
</template>

<script>
import axe from 'axe4js'
import { Toast } from 'mint-ui'
import event from '../event'
let defaultStatus = axe.data.create()
defaultStatus.setBoolean('login', false)
export default {
  name: 'Test',
  data () {
    return {
      msg: '',
      popupVisible2: false
    }
  },
  computed: {
    eventA () {
      return event.status.listenEvent('eventA')
    },
    login () {
      return event.status.listenState('LoginStatusChange', defaultStatus).get('login')
    },
    account () {
      return event.status.listenState('LoginStatusChange', defaultStatus).get('login') ? event.status.state['LoginStatusChange'].get('userInfo').account : '当前未登录！'
    }
  },
  watch: {
    eventA () {
      console.log('Test event listener!!')
      Toast('接受到 事件 eventA !!!')
    }
  },
  methods: {
    register () {
      // 错误的注册展示。 错误在于两点：
      // 1. 持有了 this，导致了内存泄漏
      // 2. 路由切换时，导致多次注册。
      // 但是如果这个页面是单例的，就可以接受这样简单的注册。
      axe.event.registerListener('eventA', () => {
        // 只有全局内容，不会有内存问题。
        console.log('eventA ： ' + this)
      })
    },
    goback () {
      this.$router.go(-1)
    },
    postEventA () {
      axe.event.postEvent('eventA')
    },
    registerEventA () {
      let rand = Math.random()
      event.notice.registerEvent(this, 'eventA', (payload) => {
        this.msg = 'evnet A ' + rand
        this.popupVisible2 = true
        console.log(this.msg)
        setTimeout(() => {
          this.popupVisible2 = false
        }, 2500)
      })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      axe.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('set_title', 'Test')
      })
    })
  }
}
</script>

<style scoped>
.button {
  margin-bottom: 8px;
}
.mint-popup-2 {
  width: 100%;
  height: 50px;
  text-align: center;
  background-color: rgba(0,0,0,.7);
  backface-visibility: hidden;
}
.imageinput {
  display: none;
}
.custom-file-upload {
  border: 0.5px solid rgba(204, 204, 204, 0.699);
  margin-top: 40px;
  margin-bottom: 8px;
  display:inline-block;
  width: 100%;
  box-sizing: content-box;
  height: 40px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
  background-color: rgba(204, 204, 204, 0.164);
}
.modal {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: '#33333333';
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 123;
}
</style>
