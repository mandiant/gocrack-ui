import axios from 'axios'
import client from './client'
import apitypes from '../types'

export default {
  getTasks (apiConfig, data) {
    // We're not using the helper here as the table component expects the raw axios response
    return axios.request({
      method: 'GET',
      xsrfHeaderName: 'X-Xsrf-Token',
      xsrfCookieName: 'XSRF-TOKEN',
      baseURL: `${apiConfig.server}${apiConfig.base_endpoint}/`,
      url: '/task/',
      params: data,
      withCredentials: true
    })
  },

  getTaskInfo (apiConfig, taskId) {
    return client.performRequest(apiConfig, 'GET', `/task/${taskId}`)
  },

  getCrackedPasswords (apiConfig, taskId) {
    return client.performRequest(apiConfig, 'GET', `/task/${taskId}/passwords`).then((response) => {
      let { data, count } = response
      if (count > 0) {
        data = data.map(el => {
          return {
            ...el,
            cracked_at: new Date(el.cracked_at).toUTCString()
          }
        })
      }
      return data
    })
  },

  modifyTask (apiConfig, taskId, payload) {
    return client.performRequest(apiConfig, 'PATCH', `/task/${taskId}`, {data: payload})
  },

  createTask (apiConfig, payload) {
    return client.performRequest(apiConfig, 'POST', `/task/`, {data: payload})
  },

  modifyTaskStatus (apiConfig, taskId, action) {
    console.log(action === apitypes.TASK_START)
    if (action === apitypes.TASK_START || action === apitypes.TASK_STOP) {
      return client.performRequest(apiConfig, 'PATCH', `/task/${taskId}/status`, {data: {state: action}})
    }
    throw Error('incorrect action. must be TASK_START or TASK_STOP')
  },

  deleteTask (apiConfig, taskId) {
    return client.performRequest(apiConfig, 'DELETE', `/task/${taskId}`)
  }
}
