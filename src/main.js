import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import storeMutations from '@/store/mutations'
import { createI18n } from './i18n'

import { ServerTable, ClientTable } from 'vue-tables-2'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import BootstrapVue from 'bootstrap-vue'
import VuePlugin from '@/api'

import 'jquery/dist/jquery.slim.min.js'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'

// Font Awesome Config
import 'font-awesome/scss/font-awesome.scss'
import '../config/font-awesome.config.js'

Vue.config.productionTip = false
window.axios = axios

Vue.use(Vuelidate)
Vue.use(ClientTable)
Vue.use(ServerTable, {}, false)
Vue.use(BootstrapVue)

// Sync vue's router with the state backend
sync(store, router)

const i18n = createI18n({defaultLocale: store.getters.getCurrentLanguage})

// install some interceptors into axios
function installInterceptors () {
  axios.interceptors.response.use((response) => {
    return response
  }, error => {
    if (error.response) {
      var response = error.response
      // If we recieve a response that indicates our token has expired, force the user to relog
      if (response.status === 401 && (response.data.hasOwnProperty('expired') && response.data.expired)) {
        console.log('intercepted an expired token. forcing state change')
        store.dispatch(storeMutations.LOGOUT)
      }
    }
    return Promise.reject(error.response)
  })

  console.log('interceptors installed')
}

installInterceptors()

axios.get('/gocrack-config.json').then(response => {
  let config = response.data
  if (config.server === undefined) {
    router.push({name: 'System Error'})
    return
  }
  Vue.use(VuePlugin, config)
}).then(() => {
  store.dispatch('initializeAuthFromStorage').then(success => {
    console.log('successfully re-initialized auth store')
    // asynchronously request permissions to browser notifications
    store.dispatch(storeMutations.NOTIFY_REQUESTED)
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      i18n,
      store,
      template: '<App/>',
      components: { App }
    })
  })
})
