import muts from '@/store/mutations'

// initial state
const state = {
  hosts: [],
  loading: false,
  refreshing: false
}

const getters = {
  getHosts: state => state.hosts,
  isWorkersLoading: state => state.loading
}

const mutations = {
  [muts.WORKER_STATUS_GET] (state) {
    state.loading = true
  },

  [muts.WORKER_STATUS_REFRESHING] (state) {
    state.loading = false
    state.refreshing = true
  },

  [muts.WORKER_STATUS_RETRIEVED] (state, workers) {
    for (let i in workers) {
      let connectedHost = workers[i]
      connectedHost.devices = connectedHost.devices.map((dev) => {
        dev.hostname = connectedHost.hostname
        dev.displayname = `${dev.name} (ID: ${dev.id})`
        return dev
      })
    }

    state.loading = false
    state.refreshing = false
    state.hosts = workers
  },

  [muts.WORKER_STATUS_FAILED] (state) {
    state.loading = false
    state.refreshing = false
  }
}

export default {
  state,
  getters,
  mutations
}
