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
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

import '@/faloader'
import config from '@/config'

import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'vue-multiselect/dist/vue-multiselect.min.css'

// Custom Components
import * as CreateTaskComponents from './components/CreateTask'

import * as HashcatComponents from './components/Hashcat'

if (config.SENTRY_DSN !== undefined || (config.SENTRY_DSN !== undefined && config.SENTRY_DSN !== '')) {
  console.log('Sentry enabled', config.SENTRY_DSN)

  Sentry.init({
    dsn: 'https://<key>@sentry.io/<project>',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}

const tableIcons = {
  base: 'fa fas',
  is: 'fa-sort',
  up: 'fa-sort-alpha-up',
  down: 'fa-sort-alpha-down'
}

const debug = process.env.NODE_ENV !== 'production'

for (let component in CreateTaskComponents) {
  Vue.component(component, CreateTaskComponents[component])
}

for (let component in HashcatComponents) {
  Vue.component(component, HashcatComponents[component])
}

Vue.config.productionTip = false
window.axios = axios

Vue.use(Vuelidate)
Vue.use(ClientTable, { sortIcon: tableIcons }, false, 'bootstrap4')
Vue.use(ServerTable, { sortIcon: tableIcons }, false, 'bootstrap4')
Vue.use(BootstrapVue)

// Sync vue's router with the state backend
sync(store, router)

const i18n = createI18n({ defaultLocale: store.getters.getCurrentLanguage })

// install some interceptors into axios
function installInterceptors () {
  axios.interceptors.response.use((response) => {
    return response
  }, error => {
    if (error.response) {
      var response = error.response
      // If we recieve a response that indicates our token has expired, force the user to relog
      if (response.status === 401 && (response.data.hasOwnProperty('expired') && response.data.expired)) {
        // console.log('intercepted an expired token. forcing state change')
        store.dispatch(storeMutations.LOGOUT)
      }
    }
    return Promise.reject(error.response)
  })
}

installInterceptors()

let BASE_URL = `${window.location.protocol}//${window.location.host}`

if (debug) {
  BASE_URL = 'http://' + window.location.hostname + ':1338'
}

Vue.use(VuePlugin, {
  server: BASE_URL,
  base_endpoint: '/api/v2'
})

store.dispatch('initializeAuthFromStorage').then(success => {
  // console.log('successfully re-initialized auth store')
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
