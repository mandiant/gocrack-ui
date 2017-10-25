import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export default {
  performRequest (apiConfig, method, route, optionalAxiosOptions = {}) {
    let axiosOptions = {
      method: method,
      withCredentials: true,
      xsrfHeaderName: 'X-Xsrf-Token',
      xsrfCookieName: 'XSRF-TOKEN',
      baseURL: `${apiConfig.server}${apiConfig.base_endpoint}/`,
      url: route,
      ...optionalAxiosOptions
    }

    if (debug) {
      console.log(`Making ${axiosOptions.method} request to server ${axiosOptions.baseURL} to path ${axiosOptions.url}`)
    }

    return axios.request(axiosOptions).then((resp) => {
      if (axiosOptions.method === 'POST' || axiosOptions.method === 'PUT' || axiosOptions.method === 'PATCH') {
        // No content
        if (resp.status === 204) {
          return true
        }
      }

      return resp.data
    })
  }
}
