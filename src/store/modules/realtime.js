import Vue from 'vue'

import config from '@/api/config'
import muts from '@/store/mutations'

const state = () => {
  return {
    es: null,
    connecting: false,
    connected: false,
    taskEngineStatus: {}, // stores realtime information about a task engine
    taskStatuses: {} // stores the task statuses
  }
}

const getters = {
  // getTaskEngineStatusById returns the current engine status
  // if we're recieving realtime messages for this task.
  getTaskEngineStatusById: (state) => (id) => {
    if (state.taskEngineStatus.hasOwnProperty(id)) {
      return state.taskEngineStatus[id]
    }
    return {running: false, status: {}}
  },

  // getTaskStatusByID returns the current task status ("running", "stopped", etc)
  // if we're recieving realtime messages for this task. Otherwise we return `defaultStatus`
  getTaskStatusByID: (state) => (id, defaultStatus = 'Unknown') => {
    if (state.taskStatuses.hasOwnProperty(id)) {
      return state.taskStatuses[id]
    }
    return defaultStatus
  }
}

const actions = {
  [muts.REALTIME_CONNECTING] ({ commit, state, rootState, dispatch }) {
    commit(muts.REALTIME_CONNECTING)

    let { server, base_endpoint } = config.get
    var es = new EventSource(`${server}${base_endpoint}/realtime/`, { withCredentials: true })  /* eslint camelcase: "off" */

    es.addEventListener('open', function () {
      commit(muts.REALTIME_CONNECTED, { es })
    })

    es.addEventListener('message', function (event) {
      dispatch(muts.REALTIME_RECV_MSG, JSON.parse(event.data))
    })

    es.addEventListener('error', () => {
      commit(muts.REALTIME_DISCONNECTED)
    })
  },

  [muts.REALTIME_RECV_MSG] ({ commit, rootState, dispatch }, payload) {
    var { message, topic } = payload
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REALTIME_RECV_MSG for topic ${topic}`, message)
    }

    switch (topic) {
      case 'cracked_password':
        // XXX(cschmitt): Browser notifications
        break
      case 'task_status':
        switch (message.status.toLowerCase()) {
          case 'queued':
          case 'dequeued':
            break
          default:
            dispatch(muts.NOTIFY_SEND, { title: 'Task Status Change', body: `${message.status} for ${message.task_id}` })
            break
        }
        commit(muts.REALTIME_TASK_STATUS, { message })
        break
      case 'task_engine_status':
        commit(muts.REALTIME_TASK_ENGINE_STATUS, { statusMessage: message, final: false })
        break
      case 'task_status_final':
        commit(muts.REALTIME_TASK_ENGINE_STATUS, { statusMessage: message, final: true })
        break
    }
  },

  [muts.REALTIME_LOGOUT] ({ commit }) {
    commit(muts.REALTIME_LOGOUT)
  }
}

const mutations = {
  [muts.REALTIME_TASK_STATUS] (state, { message }) {
    Vue.set(state.taskStatuses, message.task_id, message.status)
  },

  [muts.REALTIME_TASK_ENGINE_STATUS] (state, { statusMessage, final }) {
    // Have to use Vue.set to trigger the update in the reactivity system
    Vue.set(state.taskEngineStatus, statusMessage.task_id, {
      status: statusMessage.status,
      updated: new Date(),
      running: !final,
      stopped: final
    })
  },

  [muts.REALTIME_LOGOUT] (state) {
    if (state.es !== null) {
      state.es.close()
    }
    state.connected = false
    state.es = null
  },

  [muts.REALTIME_DISCONNECTED] (state) {
    state.connected = false
    state.es = null
  },

  [muts.REALTIME_CONNECTING] (state) {
    state.connecting = true
    state.connected = false
  },

  [muts.REALTIME_CONNECTED] (state, { es }) {
    state.es = es
    state.connecting = false
    state.connected = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
