import apis from './apis'
import GoCrackConfig from './config'

const debug = process.env.NODE_ENV !== 'production'

const VuePlugin = {
  install: function (Vue, config) {
    if (Vue._gocrack_api_installed) {
      return
    }

    if (config.server === undefined) {
      config.server = ''
    }

    Vue._gocrack_api_installed = true
    GoCrackConfig.set(config)

    if (debug) {
      console.log('GoCrack Config:', GoCrackConfig.get)
    }

    Vue.mixin({
      created () {
        this.$config = GoCrackConfig
        this.$gocrack = apis.wrapAPIWithConfig(config)
      }
    })
  }
}

export default VuePlugin
