import Vue from 'vue'
import VueI18n from 'vue-i18n'

/* Languages */
import en from './en-US.json'

Vue.use(VueI18n)

const languages = {
  default: 'en-US',
  options: {
    'en-US': en
  }
}

export function createI18n ({ defaultLocale = languages.default }) {
  var i18n = new VueI18n({
    locale: defaultLocale,
    messages: languages.options
  })

  if (module.hot) {
    console.log('Allowing for hot reload of i18n translations')
    module.hot.accept(['./en-US.json'], () => {
      i18n.setLocaleMessage('en', require('./en-US.json'))
      console.log('Reloading translations')
    })
  }

  return i18n
}

export const langs = languages
