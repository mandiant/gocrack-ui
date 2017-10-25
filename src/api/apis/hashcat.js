import client from './client'

export default {
  getHashcatTypes (apiConfig) {
    return client.performRequest(apiConfig, 'GET', '/engine/hashcat/hash_modes')
  }
}
