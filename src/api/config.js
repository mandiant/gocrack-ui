const _config = {}

const GoCrackConfig = {
  set: config => Object.assign(_config, config),
  get: _config
}

Object.freeze(GoCrackConfig)

export default GoCrackConfig
