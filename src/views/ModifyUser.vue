<template>
  <div>
    <h2>{{ $t('navbar.edit_user') }}</h2>
    <hr />

    <!-- Comment out the line below to debug the validator -->
    <!-- <pre>{{ $v }}</pre> -->
    <div class="alert alert-info" role="alert" v-if="!loaded">
      <span>{{ $t('shared.loading') }}</span>
    </div>
    <div v-else>
      <form @submit.prevent="validateBeforeSubmit">
        <!-- Email Address -->
        <div class="form-group row" :class="{ 'has-danger': $v.email.$invalid }">
          <label for="email" class="col-3 col-form-label">{{ $t('edit_user.email') }}</label>
          <div class="col-9">
            <input
              @input="$v.email.$touch()"
              class="form-control"
              type="text"
              id="email"
              v-model="email" >
              <div v-show="$v.email.$invalid" class="form-control-feedback">{{ $t('edit_user.email_invalid') }}</div>
          </div>
        </div>

        <!-- XXX(cschmitt): We're not really doing internationalization right at the moment and this switcher is kinda buggy atm
        <template v-if="userEditingOwnRecord">
           <div class="form-group row">
              <label class="col-3 col-form-label">{{ $t('shared.language') }}</label>
              <div class="col-9">
                <select class="form-control" id="langselect" v-model="lang">
                  <option v-for="lang in getAvailableLanguages">{{ lang }}</option>
                </select>
              </div>
            </div>
        </template>
        -->

        <div class="form-group row" v-if="isAdministrator">
          <label for="isadmin" class="col-3 col-form-label">{{ $t('edit_user.is_admin') }}</label>
          <div class="col-9">
            <b-form-checkbox id="isadmin" v-model="isadmin">
              {{ $t('edit_user.description_is_admin') }}
            </b-form-checkbox>
          </div>
        </div>

        <template>
          <h3>{{ $t('edit_user.header_change_password') }}</h3>
          <hr />

          <!-- Current Password -->
          <div class="form-group row" v-if="!isAdministrator">
            <label for="current_password" class="col-3 col-form-label">{{ $t('edit_user.current_password') }}</label>
            <div class="col-9">
              <input
                class="form-control"
                type="password"
                id="current_password"
                v-model="current_password" >
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group row" :class="{ 'has-danger': $v.new_password.$invalid }">
            <label for="new_password" class="col-3 col-form-label">{{ $t('edit_user.new_password') }}</label>
            <div class="col-9">
              <input
                class="form-control"
                type="password"
                id="new_password"
                @input="$v.new_password.$touch()"
                v-model="new_password" >
              <div v-show="$v.new_password.$invalid && !$v.new_password.hasCurrentPassword" class="form-control-feedback">{{ $t('edit_user.current_password_missing') }}</div>
              <div v-show="$v.new_password.$invalid && !$v.new_password.confirmMatches" class="form-control-feedback">{{ $t('edit_user.confirm_password_missing') }}</div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group row">
            <label for="confirm_password" class="col-3 col-form-label">{{ $t('edit_user.confirm_password') }}</label>
            <div class="col-9">
              <input
                class="form-control"
                type="password"
                id="confirm_password"
                v-model="confirm_password" >
            </div>
          </div>
        </template>

        <template v-if="canChangeNotifcationSettings">
          <h3>{{ $t('edit_user.header_notifications') }}</h3>
          <hr />

          <div class="form-group row">
            <label for="email" class="col-3 col-form-label">{{ $t('edit_user.browser_notifications') }}</label>
            <div class="col-9">
              <a
                role="button"
                href="#"
                class="btn"
                :class="{ 'btn-danger disabled': areNotificationsEnabled, 'btn-success': !areNotificationsEnabled}"
                @click="changeBsNotificationState()"
              >{{ browserNotificationState }}</a>
            </div>
          </div>
        </template>

        <button class="btn btn-primary btn-block" type="submit" :disabled="$v.$invalid || !this.isdirty || this.pending_update">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { email } from 'vuelidate/lib/validators'

import { ADD_TOAST_MESSAGE } from '../toast'
import helpers from '@/helpers'

export default {
  data () {
    return {
      loaded: false,
      email: '',
      isadmin: false,
      current_password: '',
      new_password: '',
      confirm_password: '',

      origrecord: null, // origrecord tracks the response of the initial user info grab and used to calculate the dirty state
      pending_update: false,
      lang: this.getCurrentLanguage
    }
  },

  props: {
    editingSelf: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    lang (value) {
      this.changeLanguage({ language: value })
    }
  },

  created () {
    this.$gocrack.getUserInfo(this.user_uuid).then((data) => {
      this.loaded = true
      this.email = data.email_address
      this.isadmin = data.is_admin
      this.origrecord = data
    }).catch((error) => {
      this.loaded = false
      let vm = this
      helpers.componentToastError(vm, error)
    })
  },

  computed: {
    user_uuid () {
      // If we're coming in from the user listing, the user uuid will be in the path
      if (this.$route.params.id !== undefined) {
        return this.$route.params.id
      }
      // otherwise lets get our current user from the state!
      return this.getAuthDetails.user_uuid
    },

    canChangeNotifcationSettings () {
      return this.areNotificationsSupported && this.editingSelf
    },

    browserNotificationState () {
      return this.areNotificationsEnabled ? this.$t('edit_user.revoke') : this.$t('edit_user.grant')
    },

    userEditingOwnRecord () {
      return this.user_uuid === this.getAuthDetails.user_uuid
    },

    // isdirty detects if the user has changed any fields in the form
    isdirty () {
      if (!this.loaded || this.origrecord === undefined || this.origrecord === null) {
        return false
      }

      if (
        this.origrecord.email_address !== this.email ||
        this.origrecord.is_admin !== this.isadmin
      ) {
        return true
      }

      if (this.new_password !== '' && this.new_password === this.confirm_password) {
        return true
      }

      return false
    },

    ...mapGetters([
      'getAuthDetails',
      'isAdministrator',
      'areNotificationsEnabled',
      'areNotificationsSupported',
      'getAvailableLanguages',
      'getCurrentLanguage'
    ])
  },

  methods: {
    validateBeforeSubmit () {
      this._submit_form()
    },

    changeBsNotificationState () {
      if (!this.areNotificationsEnabled) {
        this.requestPermission()
      }
    },

    _submit_form () {
      // determine the changes to send up
      let payload = {}
      if (this.origrecord.email_address !== this.email) {
        payload.email = this.email
      }

      if (this.origrecord.is_admin !== this.isadmin) {
        payload.user_is_admin = this.isadmin
      }

      // we only need to send the current password up if they're not an administrator
      if (this.current_password !== '' && !this.isAdministrator) {
        payload.current_password = this.current_password
      }

      if (this.new_password !== '' && this.new_password === this.confirm_password) {
        payload.new_password = this.new_password
      }

      if (Object.keys(payload).length === 0) {
        this.addToast({
          text: this.$t('edit_user.errors.no_changes'),
          type: 'danger'
        })
        return
      }

      this.$gocrack.modifyUserInfo(this.user_uuid, payload).then((data) => {
        this.addToast({
          text: `Succesfully modified ${this.user_uuid} - ${this.origrecord.username}`,
          type: 'success'
        })

        if (this.isAdministrator) {
          this.$router.push({ name: 'User Listing' })
        }
      }).catch((error) => {
        this.loaded = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE,
      requestPermission: 'requestPermission',
      changeLanguage: 'SET_LANGUAGE'
    })
  },

  validations: {
    email: {
      email
    },
    new_password: {
      hasCurrentPassword () {
        // skip this check if they're an administrator
        if (this.isAdministrator) {
          return true
        }

        // skip validation
        if (!this.$v.new_password.$dirty || this.new_password.length === 0) {
          return true
        }
        return this.current_password.length > 0
      },

      confirmMatches () {
        return this.new_password === this.confirm_password
      }
    }
  }
}
</script>
