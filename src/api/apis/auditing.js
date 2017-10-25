import client from './client'

export default {
  getAuditLog (apiConfig, entityID) {
    return client.performRequest(apiConfig, 'GET', `/audit/${entityID}`)
  }
}
