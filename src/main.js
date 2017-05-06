// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import store from './vuex/store'
import Vuex from 'vuex'
import 'font-awesome/css/font-awesome.min.css'
import Promise from 'promise-polyfill';
import 'bootstrap/dist/css/bootstrap.min.css'

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

import axios from 'axios';


Vue.use(ElementUI)
Vue.use(Vuex)

Vue.config.productionTip = false
Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
