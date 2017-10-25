import muts from '@/store/mutations'

// initial state
const state = () => {
  let supported = ('Notification' in window)
  if (!supported) {
    return {
      has_support: false,
      granted: false
    }
  }

  return {
    has_support: supported,
    granted: Notification.permission === 'granted',
    sentCrackedNotifications: {}
  }
}

const getters = {
  areNotificationsEnabled: state => state.granted,
  areNotificationsSupported: state => state.has_support
}

const actions = {
  [muts.NOTIFY_SEND] ({ commit, rootState, dispatch }, payload) {
    new Notification(  // eslint-disable-line no-new
      payload.title || 'GoCrack Notification',
      {
        body: payload.body
      }
    )
  },

  [muts.NOTIFY_REQUESTED] ({state, commit}) {
    if (state.granted) {
      return
    }

    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        commit(muts.NOTIFY_GRANTED, {granted: true})
      } else {
        commit(muts.NOTIFY_GRANTED, {granted: false})
      }
    })
  }
}

const mutations = {
  [muts.NOTIFY_GRANTED] (state, { granted }) {
    state.granted = granted
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
