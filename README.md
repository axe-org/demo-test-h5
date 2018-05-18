# demo-test-h5

使用 h5编写的 test模块，测试了 `axe`中的主要功能。

## 技术限制

目前的`axe`适用的`h5`模块 需要是 单页面应用。 

## event问题

原始的 `axe.event`的问题有两点 ：

1. 持有对象，导致内存泄漏
2. 多次注册问题。

所以还是要在`axe.event`外再封装一层。我们推荐使用一些中枢状态管理模块，来封装`event` ， 类似 `vue`和`redux` 。

但是在 `test-h5`中 ，我们基于 `Vue` 和 `Vue-router` 做了两套封装方案。

#### status

基于`Vue`， 实现类似`Vuex`的状态机制，源码见 [src/event/status.js](src/event/status.js)

通过持有一个 `Vue`对象，来做状态通知。 使用方式 ：

	// 放在 computed中，监听状态
	computed: {
	    eventA () {
	      return event.status.listenEvent('eventA')
	    },
	    login () {
	      return event.status.listenState('LoginStatusChange', defaultStatus).get('login')
	    }
	 },
	 // 但是对于需要自定义处理的通知，或者没有数据的通知，还要设置watch进行监听。
	 watch: {
	    eventA () {
	      console.log('Test event listener!!')
	      Toast('接受到 事件 eventA !!!')
	    }
	  },
	  
#### notice

基于`Vue-router` ,实现一个弱引用的事件监听机制， 源码见[src/event/notice.js](src/event/notice.js)

使用 `WeakMap` 来存储事件回调， 这样保证 组件可以正常释放。 同时，通过`Vue-router`去获取当前页面，以分发具体通知。（这就限定了，这种方式必须要使用 `vue-router` ,且事件暂时只能监听到一级路由，暂不支持嵌套路由。）

示例 ：

	//首先，必须要在一级路由上 设置ref:
	<template>
	  <div id="app">
	      <router-view ref="router"/>
	  </div>
	</template> 
	
因为我们的实现中，是通过 ：

	let currentVM = router.app.$children[0].$refs['router']
	
来找到当前展示页面的。

然后监听如此编写：

	event.notice.registerEvent(this, 'eventA', function () {
        Toast('eventA !!!!!')
      })
	event.notice.registerEvent(this, 'LoginStatusChange', function (payload) {
        if (payload.get('login')) {
          let userInfo = payload.get('userInfo')
          this.msg = `登录成功 ,信息如下 : 帐号 : ${userInfo.account} 等级: ${userInfo.level} \n detailInfo: ${JSON.stringify(userInfo.detailInfo)} \n tagList: ${JSON.stringify(userInfo.tagList)}`
        } else {
          this.msg = '退出登录！！'
        }
      })
 
 取消监听 ：
 
	 event.notice.removeListener(this, 'LoginStatusChange')
	 
注意， 监听时不要使用 `箭头函数` , `notice`中通过 `call`来传递`this`指针。

### 后续计划

`Event`在单页面应用上， 容易出现内存泄漏和重复注册的问题， 解决起来也要结合具体的开发环境和技术栈。 暂时实现了两种`Vue`上的方案， 这两个方案之后整理成单独的库。

后续其他技术栈，就可以发挥一下开源的力量了。


### 页面跳转

我们要求 h5的模块是单页面应用， 所以不应该拥有 `WebView`容器内的直接URL跳转。所以我们再次约束以下两点 ：

1. h5模块间的跳转, 不使用URL，避免`WebView`内跳转，而是使用路由系统来打开一个新的`WebView`
2. h5模块跳转外部页面， 依旧不能直接跳转， 需要做一个接口，以打开新的`WebView` .

以上两种情况，可能发生单页面应用下的`WebView`跳转，导致一些`Event`注册的问题。 这类问题，还是比较麻烦的，先记录一下。

# 打包

该模块在demo APP中，是以离线包形式接入，在后续的js模块接入管理平台时会再做优化 。 

离线包需要设定为相对路径打包，即 ：

	assetsPublicPath: './',

跟随APP打包的离线包，需要是上传处理好的 ，即经过签名的版本。
