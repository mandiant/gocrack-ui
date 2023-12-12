<template>
  <div class="form-group row">
    <label for="additionalUsers" class="col-3 col-form-label">{{ $t('create_task.additional_users') }}</label>
    <div class="col-9">
      <multiselect
        :multiple="true"
        :loading="loading"
        :options="users"
        open-direction="bottom"
        track-by="user_uuid"
        label="username"
        id="additionalUsers"
        placeholder="Add a user"
        v-model="internal_value"
        @open="onUsersSelectOpen"
        @input="onInput" />
      <small class="form-text text-muted">{{ $t('create_task.description_users') }}</small>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'
import helpers from '@/helpers'

export default {
  components: {
    Multiselect
  },

  data () {
    return {
      loading: false,
      users: [],
      internal_value: []
    }
  },

  computed: {
    ...mapGetters([
      'getAuthDetails'
    ])
  },

  methods: {
    onUsersSelectOpen () {
      // dont keep hitting the API if we've already loaded it once
      if (this.users.length > 0) {
        return
      }

      this.loading = true
      this.$gocrack.getUsers().then((users) => {
        // filter out the current user from the dropdown
        this.users = users.filter(value => {
          return value.user_uuid !== this.getAuthDetails.user_uuid
        })
        this.loading = false
      }).catch((error) => {
        this.loading = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    onInput (value, id) {
      this.$emit('usr-grant-change', value.map(user => user.user_uuid))
    }
  }
}
</script>
