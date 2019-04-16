import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import util from '@/utils/util'
import '@/css/reset.css'
import './plugins/element'
import './plugins/iview'

Vue.config.productionTip = false

Vue.use(util)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
