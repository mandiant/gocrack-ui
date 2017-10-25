import client from './client'

export default {
  loginUser (apiConfig, loginData) {
    if (loginData === undefined || typeof (loginData) !== 'object') {
      throw Error('loginData must be an object')
    }
    return client.performRequest(apiConfig, 'POST', '/login', {data: loginData})
  }
}
