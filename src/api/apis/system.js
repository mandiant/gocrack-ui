import client from './client'

export default {
  getVersionInfo (apiConfig) {
    return client.performRequest(apiConfig, 'GET', `/version/`)
  }
}
