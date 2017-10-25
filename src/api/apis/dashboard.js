import client from './client'

export default {
  getWorkers (apiConfig) {
    return client.performRequest(apiConfig, 'GET', '/workers/')
  }
}
