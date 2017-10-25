import client from './client'

export default {
  getUsers (apiConfig) {
    return client.performRequest(apiConfig, 'GET', `/users/`)
  },

  getUserInfo (apiConfig, userId) {
    return client.performRequest(apiConfig, 'GET', `/users/${userId}`)
  },

  modifyUserInfo (apiConfig, userId, payload) {
    return client.performRequest(apiConfig, 'PATCH', `/users/${userId}`, {data: payload})
  },

  createUser (apiConfig, payload) {
    return client.performRequest(apiConfig, 'POST', `/users/register`, {data: payload})
  }
}
