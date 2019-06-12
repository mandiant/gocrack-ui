<template>
  <div id="register" class="container">
    <!-- Uncomment the below line to see validation details -->
    <!-- <pre>{{ $v }}</pre> -->
    <form class="form-register" v-on:submit.prevent>
      <h2 class="form-signin-heading">{{ $t('login.register') }}</h2>

      <div class="form-group row" :class="shouldBeDangerous($v.username)">
        <label for="inputUsername" class="col-sm-2 col-form-label">{{ $t('login.username') }}</label>
        <div class="col-sm-10">
          <input
            id="inputUsername"
            type="username"
            class="form-control"
            placeholder="Username"
            v-model="username"
            @input="delayTouch($v.username)">
            <div v-show="!$v.username.required && $v.username.$error" class="form-control-feedback">{{ $t('login.validation.user_required') }}</div>
            <div v-show="!$v.username.minLength && $v.username.$error" class="form-control-feedback">{{ $t('login.validation.user_min_length') }}</div>
        </div>
      </div>

      <div class="form-group row" :class="shouldBeDangerous($v.email)">
        <label for="inputEmail" class="col-sm-2 col-form-label">{{ $t('login.email') }}</label>
        <div class="col-sm-10">
          <input
            id="inputEmail"
            type="email"
            class="form-control"
            placeholder="Email"
            v-model="email"
            @input="delayTouch($v.email)">
            <div v-show="!$v.email.required && $v.email.$error" class="form-control-feedback">{{ $t('login.validation.email_required') }}</div>
            <div v-show="!$v.email.email && $v.email.$error" class="form-control-feedback">{{ $t('login.validation.email_valid') }}</div>
        </div>
      </div>

      <div class="form-group row" :class="shouldBeDangerous($v.password)">
        <label for="inputPassword" class="col-sm-2 col-form-label">{{ $t('login.password') }}</label>
        <div class="col-sm-10">
          <input
            id="inputPassword"
            type="password"
            class="form-control"
            v-model="password"
            @input="delayTouch($v.password)">
            <div v-show="!$v.password.required && $v.password.$error" class="form-control-feedback">{{ $t('login.validation.password_required') }}</div>
            <div v-show="!$v.password.minLength && $v.password.$error" class="form-control-feedback">{{ $t('login.validation.password_min_length') }}</div>
        </div>
      </div>
      <button class="btn btn-lg btn-primary btn-block" :disabled="shouldRegisterButtonBeDisabled" @click="submit()">{{ $t('login.register') }}</button>
    </form>
  </div>
</template>

<style>
#register.container {
  max-width: 500px;
  padding: 15px;
  margin: 0 auto;
}

.form-register .form-signin-heading,
.form-register .checkbox {
  margin-bottom: 10px;
}

.form-register .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
</style>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

import storeMutations from '@/store/mutations'
import { ADD_TOAST_MESSAGE } from '@/toast'
import helpers from '@/helpers'

const touchMap = new WeakMap()

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      submittingRequest: false
    }
  },

  computed: {
    shouldRegisterButtonBeDisabled () {
      return this.submittingRequest || this.$v.$invalid
    }
  },

  methods: {
    submit () {
      this.submittingRequest = true
      this.$gocrack.createUser({ username: this.username, password: this.password, email: this.email }).then(() => {
        this.submittingRequest = false
        // Log them in!
        this.addToast({
          text: this.$t('login.created_user'),
          type: 'success',
          dismissAfter: 4000
        })
        this.$gocrack.login({ username: this.username, password: this.password }).then((token) => {
          this.$store.dispatch(storeMutations.LOGIN_SUCCESS, token)
        }).catch((error) => {
          let vm = this
          helpers.componentToastError(vm, error)
        })
      }).catch((error) => {
        this.submittingRequest = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    shouldBeDangerous ($v, c = 'has-danger') {
      return $v.$dirty && $v.$invalid ? c : ''
    },

    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  },

  validations: {
    username: {
      required,
      minLength: minLength(4)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    }
  }
}
</script>
