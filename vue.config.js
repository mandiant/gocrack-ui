var webpack = require('webpack')

module.exports = {
  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: true,
  configureWebpack: config => {
    var plugins = [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'Popper': 'popper.js'
      })
    ]

    return { plugins: plugins }
  }
}
