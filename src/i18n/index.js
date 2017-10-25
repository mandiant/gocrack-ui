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

export function createI18n ({defaultLocale = languages.default}) {
  return new VueI18n({
    locale: defaultLocale,
    messages: languages.options
  })
}

export const langs = languages
