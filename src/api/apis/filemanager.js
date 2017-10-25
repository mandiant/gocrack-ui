import client from './client'
import apitypes from '../types'

export default {
  getTaskFiles (apiConfig, entityID) {
    return client.performRequest(apiConfig, 'GET', `/files/task/`)
  },

  getEngineFiles (apiConfig) {
    return client.performRequest(apiConfig, 'GET', `/files/engine/`)
  },

  uploadFile (apiConfig, file, fileType, params, progressFunc = undefined) {
    let url
    switch (fileType) {
      case apitypes.FILE_ENGINE:
        url = `/files/engine/${file.name}`
        break
      case apitypes.FILE_TASK:
        url = `/files/task/${file.name}`
        break
      default:
        throw Error('fileType must be FILE_ENGINE or FILE_TASK')
    }

    let data = new FormData()
    data.append('file', file)

    let axiosconfig = {params: params, data: data}
    if (progressFunc !== undefined) {
      axiosconfig.onUploadProgress = progressFunc
    }
    return client.performRequest(apiConfig, 'PUT', url, axiosconfig)
  },

  downloadFile (apiConfig, fileID, fileType) {
    let url
    switch (fileType) {
      case apitypes.FILE_ENGINE:
        url = `/files/engine/${fileID}/download`
        break
      case apitypes.FILE_TASK:
        url = `/files/task/${fileID}/download`
        break
      default:
        throw Error('fileType must be FILE_ENGINE or FILE_TASK')
    }

    return client.performRequest(apiConfig, 'GET', url)
  },

  deleteFile (apiConfig, fileID, fileType) {
    let url
    switch (fileType) {
      case apitypes.FILE_ENGINE:
        url = `/files/engine/${fileID}`
        break
      case apitypes.FILE_TASK:
        url = `/files/task/${fileID}`
        break
      default:
        throw Error('fileType must be FILE_ENGINE or FILE_TASK')
    }

    return client.performRequest(apiConfig, 'DELETE', url)
  }
}
