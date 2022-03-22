// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import store from '@/store/index'
import 'element-ui/lib/theme-chalk/index.css'; // element-ui 样式
import '@/styles/index.scss' // global css
import x2js from 'x2js'
Vue.prototype.$x2js = new x2js()

Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
