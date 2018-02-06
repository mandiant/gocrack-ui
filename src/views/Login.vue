<template>
  <div class="login">
    <form class="form-signin" v-on:submit.prevent>
      <h2 class="form-signin-heading">{{ $t('login.header') }}</h2>
      <input type="username" id="inputUsername" class="form-control" :placeholder="$t('login.placeholder_username')" v-model="credentials.username" autofocus>
      <input type="password" id="inputPassword" class="form-control" :placeholder="$t('login.placeholder_password')" v-model="credentials.password">
      <router-link to="/register" exact>
        <a href="#" class="btn btn-success btn-lg btn-block" role="button" aria-pressed="true" v-if="canUserRegister">{{ $t('login.register') }}</a>
      </router-link>
      <button class="btn btn-lg btn-primary btn-block" :disabled="isAuthPending" @click="submit()">{{ $t('login.button_login') }}</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import storeMutations from '@/store/mutations'
import { ADD_TOAST_MESSAGE } from '@/toast'

import helpers from '@/helpers'

export default {

  data () {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },

  computed: {
    canUserRegister () {
      if (this.$config.get.registration_enabled === undefined || this.$config.get.registration_enabled === null) {
        return true
      }
      return this.$config.get.registration_enabled
    },

    ...mapGetters([
      'isAuthPending',
      'userIsLoggedIn'
    ])
  },

  beforeMount () {
    // Check and see if the username is already logged in and redirect them back to the dashboard
    if (this.userIsLoggedIn) {
      this.$router.push('/')
    }
  },

  methods: {
    submit () {
      let credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }

      if (credentials.username === '' || credentials.password === '') {
        this.addToast({
          text: this.$t('login.validation.empty_fields'),
          type: 'danger',
          dismissAfter: 4000
        })
        return
      }

      this.loginSubmitted()
      this.$gocrack.login(credentials).then((token) =>
        this.$store.dispatch(storeMutations.LOGIN_SUCCESS, token)
      ).catch((error) => {
        this.loginFailed()
        this.credentials.password = ''
        helpers.componentToastError(this, error)
      })
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    }),

    ...mapMutations({
      loginSubmitted: storeMutations.LOGIN_PENDING,
      loginFailed: storeMutations.LOGIN_FAILED
    })
  }
}
</script>
