import { langs } from '@/i18n'
import muts from '@/store/mutations'

const state = () => {
  return {
    language: localStorage.getItem('i18_lang') || langs.default
  }
}

const getters = {
  getAvailableLanguages () {
    return Object.keys(langs.options)
  },
  getCurrentLanguage: state => state.language
}

const actions = {
  [muts.SET_LANGUAGE] ({ commit, rootState, dispatch }, props) {
    commit(muts.SET_LANGUAGE, {language: props.language})
  }
}

const mutations = {
  [muts.SET_LANGUAGE] (state, { language }) {
    localStorage.setItem('i18_lang', language)
    state.language = language
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
