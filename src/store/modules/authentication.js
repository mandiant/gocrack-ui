import { ADD_TOAST_MESSAGE } from '@/toast'
import muts from '@/store/mutations'
import router from '@/router'

import jwtdecode from 'jwt-decode'

// initial state
const state = {
  username: '',
  user_uuid: '',
  authenticated: false,
  is_admin: false,
  pending: false,
  token: ''
}

const getters = {
  isAuthPending: state => state.pending,
  userIsLoggedIn: state => state.authenticated,
  isAdministrator: state => state.is_admin,
  getAuthDetails: state => state,
  getCurrentAuthToken: state => state.token
}

const actions = {
  // performLogin takes the credentials from the view, passes it to the API, and
  // fires the correct mutator based on the validity of the login
  [muts.LOGIN_SUCCESS] ({ commit, rootState, dispatch }, response) {
    let { token } = response

    try {
      let decodedToken = jwtdecode(token)
      commit(muts.LOGIN_SUCCESS, { token, ...decodedToken })
      dispatch(muts.REALTIME_CONNECTING)
      if (rootState.route.query.redirect) {
        router.push(rootState.route.query.redirect)
      } else {
        router.push('/')
      }
    } catch (err) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: 'Login failed: Invalid JWT from Server',
        type: 'danger',
        dismissAfter: 4000
      })

      console.log('An error occurred while validating the JWT: ', err)
      commit(muts.LOGIN_FAILED)
    }
  },

  // destroy's the state for the authentication
  [muts.LOGOUT] ({ commit, dispatch }) {
    commit(muts.LOGOUT)
    dispatch(muts.REALTIME_LOGOUT)
    router.push('/login')

    dispatch(ADD_TOAST_MESSAGE, {
      text: 'Logout successful',
      type: 'info',
      dismissAfter: 4000
    })
  },

  // initializeAuthFromStorage should be called from the application's
  // entrypoint and (re)initializes the authentication state if it's valid
  initializeAuthFromStorage ({ commit, dispatch }) {
    var token = localStorage.getItem('auth_token')
    if (token === null || token === '') {
      commit(muts.LOGOUT)
      return
    }

    var nowSeconds = Math.round(new Date().getTime() / 1000)
    try {
      var resp = jwtdecode(token)
      if (resp.exp <= nowSeconds) {
        console.log('token has expired')
        commit(muts.LOGOUT)
      } else {
        console.log('Reloaded user state from local storage')
        commit(muts.LOGIN_SUCCESS, { ...resp, token })
        dispatch(muts.REALTIME_CONNECTING)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

const mutations = {
  [muts.LOGIN_PENDING] (state) {
    state.pending = true
  },

  [muts.LOGIN_SUCCESS] (state, payload) {
    localStorage.setItem('auth_token', payload.token)
    state.username = payload.username
    state.user_uuid = payload.user_uuid
    state.is_admin = payload.is_admin
    state.pending = false
    state.authenticated = true
    state.token = payload.token
  },

  [muts.LOGIN_FAILED] (state) {
    state.pending = false
  },

  [muts.LOGOUT] (state) {
    state.is_admin = false
    state.authenticated = false
    state.username = ''
    state.user_uuid = ''
    localStorage.removeItem('auth_token')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
