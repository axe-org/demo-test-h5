<template>
  <div class="hello">
    <!-- 路由测试 -->
    <mt-button class="button" @click.native="login" size="large">login</mt-button>
    <mt-button class="button" @click.native="register" size="large">register</mt-button>
    <mt-button class="button" @click.native="loginCallback" size="large">login with callback</mt-button>
    <mt-button class="button" @click.native="registerCallback" size="large">register with callback</mt-button>
    <mt-button class="button" @click.native="loginWithPayload" size="large">login(123455678)</mt-button>
    <!-- 数据测试 -->
    <label class="custom-file-upload">
      <input class="imageinput" type="file" accept="image/jpeg" @change="selectImage" />
      setImage
    </label>
    <div class="modal" v-if="imageVisiable">
      <img style="width: 300px; height: 300px;" :src="img"/>
    </div>
    <mt-button class="button" @click.native="getImage" size="large">getImage</mt-button>
    <mt-button class="button" @click.native="setBasicData" size="large">setBasicData</mt-button>
    <mt-button class="button" @click.native="getBasicData" size="large">getBasicData</mt-button>
    <mt-button class="button" @click.native="setModel" size="large">setModel</mt-button>
    <mt-button class="button" @click.native="getModel" size="large">getModel</mt-button>
    <mt-button class="button" @click.native="setDate" size="large">setDate</mt-button>
    <mt-button class="button" @click.native="getDate" size="large">getDate</mt-button>
    <mt-button class="button" @click.native="remove" size="large">remove('date')</mt-button>
    <!-- 事件测试 -->
    <mt-popup v-model="popupVisible2" position="top" class="mint-popup-2" :modal="false">
      <div style="color: #fff;font-size: 11px;">notice : {{ msg }}</div>
    </mt-popup>
    <mt-button style="margin-top: 30px;" class="button" @click.native="reigsterEventA" size="large">reigsterEventA</mt-button>
    <mt-button class="button" @click.native="removeEventA" size="large">removeEventA</mt-button>
    <mt-button class="button" @click.native="postEventA" size="large">postEventA</mt-button>
    <mt-button class="button" @click.native="listenToLoginStatus" size="large">listenToLoginStatus</mt-button>
    <mt-button class="button" @click.native="removeLoginListener" size="large">removeLoginListener</mt-button>
    <mt-button class="button" @click.native="logOut" size="large">logOut</mt-button>
    <mt-button class="button" @click.native="moreEventTest" size="large">moreEventTest</mt-button>
  </div>
</template>

<script>
import axe from 'axe4js'
import { Toast } from 'mint-ui'
import event from '../event'
export default {
  name: 'Home',
  data () {
    return {
      popupVisible2: false,
      msg: '',
      imageVisiable: false,
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAkCAYAAABIdFAMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHhJREFUeNo8zjsOxCAMBFB/KEAUFFR0Cbng3nQPw68ArZdAlOZppPFIBhH5EAB8b+Tlt9MYQ6i1BuqFaq1CKSVcxZ2Acs6406KUgpt5/LCKuVgz5BDCSb13ZO99ZOdcZGvt4mJjzMVKqcha68iIePB86GAiOv8CDADlIUQBs7MD3wAAAABJRU5ErkJggg%3D%3D'
    }
  },
  methods: {
    login () {
      axe.router.route('axes://login/login')
    },
    register () {
      axe.router.route('axes://login/register')
    },
    loginCallback () {
      axe.router.route('axes://login/login', undefined, (payload) => {
        let userModel = payload.get('userInfo')
        Toast(`登录成功 ,信息如下 ：\n 帐号 : ${userModel.account} \n 等级: ${userModel.level} \n detailInfo: ${JSON.stringify(userModel.detailInfo)} \n tagList: ${userModel.tagList}`)
      })
    },
    registerCallback () {
      axe.router.route('axes://login/register', undefined, (payload) => {
        let userModel = payload.get('userInfo')
        Toast(`注册成功 ,信息如下 ：\n 帐号 : ${userModel.account} \n 等级: ${userModel.level} \n detailInfo: ${JSON.stringify(userModel.detailInfo)} \n tagList: ${userModel.tagList}`)
      })
    },
    loginWithPayload () {
      let payload = axe.data.create()
      payload.setString('account', '123455678')
      axe.router.route('axes://login/login', payload, (payload) => {
        let userModel = payload.get('userInfo')
        Toast(`登录成功 ,信息如下 ：\n 帐号 : ${userModel.account} \n 等级: ${userModel.level} \n detailInfo: ${JSON.stringify(userModel.detailInfo)} \n tagList: ${userModel.tagList}`)
      })
    },
    getImage () {
      axe.data.sharedData.get('image', (imgstr) => {
        if (imgstr) {
          this.img = imgstr
          this.imageVisiable = true
          setTimeout(() => {
            this.imageVisiable = false
          }, 3000)
        } else {
          Toast(`当前未设置 key为 image的图片，或者读取失败`)
        }
      })
    },
    selectImage (event) {
      let files = event.target.files
      let file = files[0]
      let reader = new FileReader()
      reader.onload = (e) => {
        let result = e.target.result
        axe.data.sharedData.setImage('image', result)
        Toast(' 图片设置成功 ！！！')
      }
      reader.readAsDataURL(file)
    },
    setBasicData () {
      axe.data.sharedData.setNumber('number', 2)
      axe.data.sharedData.setBoolean('boolean', false)
      axe.data.sharedData.setString('string', 'html-string')
      axe.data.sharedData.setArray('array', ['v', 'u', 'e'])
      axe.data.sharedData.setObject('object', {type: 'html', world: 'hello'})
      Toast('设置基础数据！！')
    },
    getBasicData () {
      let message = ''
      // TODO 回调地狱，还是要把异步操作用promise包装一下。
      axe.data.sharedData.get('number', (n) => {
        message += `number : ${n} \n`
        axe.data.sharedData.get('boolean', (b) => {
          message += `boolean : ${b} \n`
          axe.data.sharedData.get('string', (s) => {
            message += `string : ${s} \n`
            axe.data.sharedData.get('array', (a) => {
              message += `array : ${a} \n`
              axe.data.sharedData.get('object', (o) => {
                message += `object : ${JSON.stringify(o)} `
                Toast(message)
              })
            })
          })
        })
      })
    },
    getModel () {
      axe.data.sharedData.get('model', (model) => {
        if (model) {
          let message = ''
          message += `string : ${model.string} \n`
          message += `number : ${model.number} \n`
          message += `map : ${JSON.stringify(model.map)} \n`
          message += `list : ${model.list} \n`
          Toast(message)
        } else {
          Toast('当前未设置 相应键值的model类型 ！')
        }
      })
    },
    setModel () {
      let model = {
        string: 'html',
        number: 1231,
        map: {},
        list: null // 对于空值， 一定要设置 null。
      }
      axe.data.sharedData.setModel('model', model)
      Toast('设置 model 类型！')
    },
    setDate () {
      let date = new Date()
      axe.data.sharedData.setDate('date', date)
      Toast('设置当前时间！')
    },
    getDate () {
      axe.data.sharedData.get('date', date => {
        Toast('date : ' + date)
      })
    },
    remove () {
      axe.data.sharedData.removeItem('date')
      Toast('成功删除 key 为 date 的数据 ！')
    },
    moreEventTest () {
      this.$router.push('/test')
    },
    reigsterEventA () {
      event.notice.registerEvent(this, 'eventA', function () {
        Toast('eventA !!!!!')
      })
      Toast('成功注册监听！')
    },
    removeEventA () {
      event.notice.removeListener(this, 'eventA')
      Toast('成功注销！')
    },
    postEventA () {
      axe.event.postEvent('eventA')
    },
    listenToLoginStatus () {
      // 注意回调函数，不要使用 (payload) => {}的形式， this指针由 notice传入！！！
      event.notice.registerEvent(this, 'LoginStatusChange', function (payload) {
        if (payload.get('login')) {
          let userInfo = payload.get('userInfo')
          this.msg = `登录成功 ,信息如下 : 帐号 : ${userInfo.account} 等级: ${userInfo.level} \n detailInfo: ${JSON.stringify(userInfo.detailInfo)} \n tagList: ${JSON.stringify(userInfo.tagList)}`
        } else {
          this.msg = '退出登录！！'
        }
        this.popupVisible2 = true
        console.log(this.msg)
        setTimeout(() => {
          this.popupVisible2 = false
        }, 2500)
      })
    },
    removeLoginListener () {
      event.notice.removeListener(this, 'LoginStatusChange')
      Toast('成功注销！')
    },
    logOut () {
      axe.data.sharedData.removeItem('userInfo')
      let payload = axe.data.create()
      payload.setBoolean('login', false)
      axe.event.postEvent('LoginStatusChange', payload)
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      axe.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('set_title', 'Html')
      })
    })
  }
}
</script>

<style scoped>
.button {
  margin-bottom: 8px;
}
.imageinput {
  display: none;
}
.mint-popup-2 {
  width: 100%;
  height: 50px;
  text-align: center;
  background-color: rgba(0,0,0,.7);
  backface-visibility: hidden;
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
