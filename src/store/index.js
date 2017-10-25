import Vue from 'vue'
import Vuex from 'vuex'

import { createModule } from '@/toast'
import authmod from '@/store/modules/authentication'
import workersmod from '@/store/modules/workers'
import realtimemod from '@/store/modules/realtime'
import browsernotify from '@/store/modules/browser_notify'
import usersettings from '@/store/modules/user_local_settings'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    toast: createModule({
      dismissInterval: 8000
    }),
    auth: authmod,
    realtime: realtimemod,
    workers: workersmod,
    browsernotify: browsernotify,
    usersettings: usersettings
  },
  strict: debug
})

if (module.hot) {
  module.hot.accept([
    './modules/authentication',
    './modules/realtime',
    './modules/workers',
    './modules/browser_notify',
    './modules/user_local_settings'
  ], () => {
    store.hotUpdate({
      modules: {
        auth: require('./modules/authentication'),
        realtime: require('./modules/realtime'),
        workers: require('./modules/workers'),
        browsernotify: require('./modules/browser_notify'),
        usersettings: require('./modules/user_local_settings')
      }
    })
  })
}

export default store
