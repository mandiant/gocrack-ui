const PREFIX = '@@toast/'

const ADD = `${PREFIX}ADD_TOAST_MESSAGE`
const REMOVE = `${PREFIX}REMOVE_TOAST_MESSAGE`

export {
  ADD as ADD_TOAST_MESSAGE,
  REMOVE as REMOVE_TOAST_MESSAGE
}

function createMessage (id, text, type, dismissAfter) {
  return {
    id,
    text,
    type,
    dismissAfter
  }
}

export function createModule (options = {}) {
  const {
    dismissInterval = 5000
  } = options

  let maxToastId = 0

  const state = {
    messages: []
  }

  const getters = {
    toastMessages: (state) => state.messages
  }

  const actions = {
    [ADD] ({ commit }, { text, type = 'info', dismissAfter = dismissInterval }) {
      const id = ++maxToastId
      commit(ADD, createMessage(id, text, type, dismissAfter))
      setTimeout(() => commit(REMOVE, id), dismissAfter)
    },

    [REMOVE] ({ commit }, id) {
      commit(REMOVE, id)
    }
  }

  const mutations = {
    [ADD] (state, data) {
      state.messages.push(data)
    },

    [REMOVE] (state, id) {
      state.messages = state.messages.filter(m => m.id !== id)
    }
  }

  return {
    state,
    getters,
    actions,
    mutations
  }
}
